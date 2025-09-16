use objc2::{
  DefinedClass, MainThreadMarker, MainThreadOnly, define_class,
  ffi::{OBJC_ASSOCIATION_RETAIN_NONATOMIC, objc_setAssociatedObject},
  msg_send,
  rc::Retained,
  runtime::{AnyObject, ProtocolObject},
};
use objc2_app_kit::{NSApplicationPresentationOptions, NSWindow, NSWindowButton, NSWindowDelegate};
use objc2_foundation::{NSNotification, NSObject, NSObjectProtocol};
use tauri::{Emitter, LogicalPosition, Runtime, WebviewWindow};

static DELEGATE_ASSOC_KEY: u8 = 0;

unsafe fn set_associated_delegate(
  window: &NSWindow,
  delegate: &Retained<PopcornTimeWindowDelegate>,
) {
  unsafe {
    let key = &DELEGATE_ASSOC_KEY as *const _ as *const core::ffi::c_void;
    let win_obj = window as *const _ as *mut AnyObject;
    let ptr = Retained::<PopcornTimeWindowDelegate>::as_ptr(delegate) as *mut AnyObject;
    objc_setAssociatedObject(win_obj, key, ptr, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
  }
}

pub(crate) fn update<R: Runtime>(window: &WebviewWindow<R>, inset: &LogicalPosition<f64>) {
  position_traffic_lights(
    unsafe {
      let ptr = window.ns_window().expect("qed; valid window") as *mut NSWindow;
      Retained::retain(ptr).expect("qed; valid ptr")
    },
    inset,
  );
}

fn position_traffic_lights(ns_window: Retained<NSWindow>, inset: &LogicalPosition<f64>) {
  unsafe {
    let close = ns_window
      .standardWindowButton(NSWindowButton::CloseButton)
      .expect("qed; valid close button");
    let minimize = ns_window
      .standardWindowButton(NSWindowButton::MiniaturizeButton)
      .expect("qed; valid minimize button");
    let zoom = ns_window
      .standardWindowButton(NSWindowButton::ZoomButton)
      .expect("qed; valid zoom button");

    let title_bar_container_view = close
      .superview()
      .expect("qed; valid superview")
      .superview()
      .expect("qed; valid superview");

    let zoom_rect = zoom.frame();
    let close_rect = close.frame();
    let minimize_rect = minimize.frame();
    let button_height = close_rect.size.height;
    let space_between = zoom_rect.origin.x - minimize_rect.origin.x;

    let title_bar_frame_height = button_height + inset.y;
    let mut title_bar_rect = title_bar_container_view.frame();
    title_bar_rect.size.height = title_bar_frame_height;
    title_bar_rect.origin.y = ns_window.frame().size.height - title_bar_frame_height;
    title_bar_container_view.setFrame(title_bar_rect);

    let window_buttons = vec![close, minimize, zoom];
    for (i, button) in window_buttons.into_iter().enumerate() {
      let mut rect = button.frame();
      rect.origin.x = inset.x + (i as f64 * space_between);
      button.setFrameOrigin(rect.origin);
    }
  }
}
#[derive(Debug)]
struct WindowState {
  window: WebviewWindow,
  traffic_lights_inset: LogicalPosition<f64>,
}

pub struct PopcornTimeWindowDelegateIvars {
  app_state: WindowState,
  super_delegate: Retained<ProtocolObject<dyn NSWindowDelegate>>,
}

define_class!(
  #[unsafe(super(NSObject))]
  #[name = "PopcornTimeWindowDelegate"]
  #[thread_kind = MainThreadOnly]
  #[ivars = PopcornTimeWindowDelegateIvars]
  pub struct PopcornTimeWindowDelegate;

  unsafe impl NSObjectProtocol for PopcornTimeWindowDelegate {}
  unsafe impl NSWindowDelegate for PopcornTimeWindowDelegate {
    #[unsafe(method(windowShouldClose:))]
    fn window_should_close(&self, sender: &NSWindow) -> bool {
      let super_del = &self.ivars().super_delegate;
      unsafe { super_del.windowShouldClose(sender) }
    }

    #[unsafe(method(windowWillClose:))]
    fn window_will_close(&self, notification: &NSNotification) {
      let super_del = &self.ivars().super_delegate;
      unsafe {
        super_del.windowWillClose(notification);
      }
    }

    #[unsafe(method(windowDidResize:))]
    fn window_did_resize(&self, notification: &NSNotification) {
      let state = &self.ivars().app_state;
      assert!(state.window.ns_window().is_ok(), "qed; valid window");
      update(&state.window, &state.traffic_lights_inset);

      let super_del = &self.ivars().super_delegate;
      unsafe {
        super_del.windowDidResize(notification);
      }
    }

    #[unsafe(method(windowDidMove:))]
    fn window_did_move(&self, notification: &NSNotification) {
      let super_del = &self.ivars().super_delegate;
      unsafe {
        super_del.windowDidMove(notification);
      }
    }

    #[unsafe(method(windowDidChangeBackingProperties:))]
    fn window_did_change_backing_properties(&self, notification: &NSNotification) {
      let super_del = &self.ivars().super_delegate;
      unsafe {
        super_del.windowDidChangeBackingProperties(notification);
      }
    }

    #[unsafe(method(windowDidBecomeKey:))]
    fn window_did_become_key(&self, notification: &NSNotification) {
      let super_del = &self.ivars().super_delegate;
      unsafe {
        super_del.windowDidBecomeKey(notification);
      }
    }

    #[unsafe(method(windowDidResignKey:))]
    fn window_did_resign_key(&self, notification: &NSNotification) {
      let super_del = &self.ivars().super_delegate;
      unsafe {
        super_del.windowDidResignKey(notification);
      }
    }

    #[unsafe(method(window:willUseFullScreenPresentationOptions:))]
    fn window_will_use_full_screen_presentation_options(
      &self,
      window: &NSWindow,
      proposed_options: NSApplicationPresentationOptions,
    ) -> NSApplicationPresentationOptions {
      let super_del = &self.ivars().super_delegate;
      unsafe { super_del.window_willUseFullScreenPresentationOptions(window, proposed_options) }
    }

    #[unsafe(method(windowDidEnterFullScreen:))]
    fn window_did_enter_full_screen(&self, notification: &NSNotification) {
      let state = &self.ivars().app_state;
      state
        .window
        .emit("did-enter-fullscreen", ())
        .expect("Failed to emit event");

      let super_del = &self.ivars().super_delegate;
      unsafe {
        super_del.windowDidEnterFullScreen(notification);
      }
    }

    #[unsafe(method(windowWillEnterFullScreen:))]
    fn window_will_enter_full_screen(&self, notification: &NSNotification) {
      let state = &self.ivars().app_state;
      state
        .window
        .emit("will-enter-fullscreen", ())
        .expect("Failed to emit event");

      let super_del = &self.ivars().super_delegate;
      unsafe {
        super_del.windowWillEnterFullScreen(notification);
      }
    }

    #[unsafe(method(windowDidExitFullScreen:))]
    fn window_did_exit_full_screen(&self, notification: &NSNotification) {
      let state = &self.ivars().app_state;
      state
        .window
        .emit("did-exit-fullscreen", ())
        .expect("Failed to emit event");

      let super_del = &self.ivars().super_delegate;
      unsafe { super_del.windowDidExitFullScreen(notification) }
    }

    #[unsafe(method(windowWillExitFullScreen:))]
    fn window_will_exit_full_screen(&self, notification: &NSNotification) {
      let state = &self.ivars().app_state;
      state
        .window
        .emit("will-exit-fullscreen", ())
        .expect("Failed to emit event");

      let super_del = &self.ivars().super_delegate;
      unsafe {
        super_del.windowWillExitFullScreen(notification);
      }
    }

    #[unsafe(method(windowDidFailToEnterFullScreen:))]
    fn window_did_fail_to_enter_full_screen(&self, window: &NSWindow) {
      let super_del = &self.ivars().super_delegate;
      unsafe {
        super_del.windowDidFailToEnterFullScreen(window);
      }
    }
  }
);

pub(crate) fn setup_nswindow_delegates(
  window: &WebviewWindow,
  traffic_lights_inset: LogicalPosition<f64>,
) {
  // initial position
  update(window, &traffic_lights_inset);

  let ptr = window.ns_window().expect("Failed to create window handle") as *mut NSWindow;
  let ns_window = unsafe { Retained::retain(ptr).expect("retain NSWindow") };

  let current_delegate = unsafe { ns_window.delegate().expect("qed; valid tao delegate") };

  let app_state = WindowState {
    window: window.clone(),
    traffic_lights_inset,
  };

  let delegate_class = MainThreadMarker::new()
    .expect("qed; main thread")
    .alloc::<PopcornTimeWindowDelegate>()
    .set_ivars(PopcornTimeWindowDelegateIvars {
      app_state,
      super_delegate: current_delegate,
    });

  let delegate: Retained<PopcornTimeWindowDelegate> =
    unsafe { msg_send![super(delegate_class), init] };
  ns_window.setDelegate(Some(ProtocolObject::from_ref(&*delegate)));

  unsafe {
    // attach delegate to the window
    // this keep the delegate alive
    // deallocate when window is destroyed
    set_associated_delegate(&ns_window, &delegate);
  }
}
