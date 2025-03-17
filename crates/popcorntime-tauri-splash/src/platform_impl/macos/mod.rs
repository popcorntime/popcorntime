use crate::WindowSplashExt;
use objc2::runtime::AnyObject;
use objc2::{rc::Retained, MainThreadMarker, MainThreadOnly};
use objc2_app_kit::{
  NSAutoresizingMaskOptions, NSControlSize, NSProgressIndicator, NSProgressIndicatorStyle,
  NSVisualEffectBlendingMode, NSVisualEffectMaterial, NSVisualEffectState, NSVisualEffectView,
  NSWindow,
};
use objc2_app_kit::{NSUserInterfaceItemIdentification, NSUserInterfaceItemIdentifier, NSView};
use objc2_foundation::{NSPoint, NSRect, NSSize};
use tauri::{Runtime, WebviewWindow};

const SPLASH_CONTAINER_ID: &str = "pt.splash.container";

impl<R: Runtime> WindowSplashExt for WebviewWindow<R> {
  fn setup_splashscreen(&self) -> tauri::Result<()> {
    let window = self.clone();
    self.run_on_main_thread(move || {
      let mtm = MainThreadMarker::new().unwrap();

      // hide webview
      let _ = window.with_webview(|webview| unsafe {
        let view_ptr = webview.inner() as *mut AnyObject;
        let view: &mut NSView = &mut *(view_ptr as *mut NSView);
        view.setHidden(true);
      });

      unsafe {
        let ns_win_ptr = window.ns_window().expect("qed; valid ns_window");
        let ns_win = Retained::from_raw(ns_win_ptr as *mut NSWindow).expect("qed; valid ptr");
        let content = ns_win.contentView().expect("qed; valid contentView");
        let bounds = content.bounds();

        let container = NSView::initWithFrame(NSView::alloc(mtm), bounds);
        container.setAutoresizingMask(
          NSAutoresizingMaskOptions::ViewWidthSizable
            .union(NSAutoresizingMaskOptions::ViewHeightSizable),
        );

        let ident = NSUserInterfaceItemIdentifier::from_str(SPLASH_CONTAINER_ID);
        container.setIdentifier(Some(&ident));

        let vib = NSVisualEffectView::init(NSVisualEffectView::alloc(mtm));
        vib.setBlendingMode(NSVisualEffectBlendingMode::BehindWindow);
        vib.setMaterial(NSVisualEffectMaterial::HUDWindow);
        vib.setState(NSVisualEffectState::Active);
        vib.setFrame(bounds);
        vib.setAutoresizingMask(
          NSAutoresizingMaskOptions::ViewWidthSizable
            .union(NSAutoresizingMaskOptions::ViewHeightSizable),
        );
        container.addSubview(&vib);

        let spinner = NSProgressIndicator::init(NSProgressIndicator::alloc(mtm));
        spinner.setStyle(NSProgressIndicatorStyle::Spinning);
        spinner.setDisplayedWhenStopped(true);
        spinner.setControlSize(NSControlSize::Regular);
        let w = 56.0;
        let h = 56.0;
        spinner.setFrame(NSRect::new(
          NSPoint::new(
            bounds.size.width * 0.5 - w * 0.5,
            bounds.size.height * 0.5 - h * 0.5,
          ),
          NSSize::new(w, h),
        ));
        spinner.startAnimation(None);
        container.addSubview(&spinner);

        content.addSubview(&container);
      }
    })
  }

  fn revert_splashscreen(&self) -> tauri::Result<()> {
    let window = self.clone();

    self.run_on_main_thread(move || {
      // show webview
      let _ = window.with_webview(|webview| unsafe {
        let view_ptr = webview.inner() as *mut AnyObject;
        let view: &mut NSView = &mut *(view_ptr as *mut NSView);
        view.setHidden(false);
      });
      unsafe {
        let ns_win_ptr = window.ns_window().expect("qed; valid ns_window");
        let ns_win = Retained::from_raw(ns_win_ptr as *mut NSWindow).expect("qed; valid ptr");
        let content = ns_win.contentView().expect("qed; valid contentView");
        let subviews = content.subviews();

        // find and remove splash container
        for v in &subviews {
          if let Some(id) = v.identifier() {
            if id.to_string() == SPLASH_CONTAINER_ID {
              v.removeFromSuperview();
              break;
            }
          }
        }
      }
    })
  }
}
