#[cfg(target_os = "macos")]
use popcorntime_tauri_splash::WindowSplashExt;
#[cfg(target_os = "macos")]
use popcorntime_tauri_trafficlights::WindowExt;
use tauri::webview::PageLoadPayload;

pub const MAIN_WINDOW_LABEL: &str = "main";

#[tauri::command]
pub fn show_main_window(_window: tauri::WebviewWindow) {
  #[cfg(target_os = "macos")]
  {
    _window.revert_splashscreen().ok();
  }
}

fn on_page_load_script(webview: tauri::WebviewWindow, payload: PageLoadPayload) {
  let platform = {
    #[cfg(target_os = "windows")]
    {
      "windows"
    }

    #[cfg(target_os = "linux")]
    {
      "linux"
    }

    #[cfg(target_os = "macos")]
    {
      "macos"
    }

    #[cfg(not(any(target_os = "windows", target_os = "linux", target_os = "macos")))]
    {
      "unknown"
    }
  };
  let is_html = payload.url().path().to_string().contains("index.html");
  if is_html {
    let theme = webview
      .theme()
      .ok()
      .map(|t| t.to_string())
      .unwrap_or("light".to_string());
    let eval = webview.eval(format!(
      r#"window.addEventListener('DOMContentLoaded', () => {{
                  const root = document.documentElement;
                  root.setAttribute('data-platform', '{}');
                  root.setAttribute('data-theme', '{}');
                  setTimeout(() => {{
                    window.__TAURI_INTERNALS__.invoke("show_main_window");
                  }}, 100);
                }});"#,
      platform, theme
    ));

    if let Err(e) = eval {
      tracing::error!("failed to execute on_page_load_script: {e}");
    }
  }
}

fn window_builder<'a>(
  handle: &'a tauri::AppHandle,
  window_relative_url: &str,
) -> tauri::WebviewWindowBuilder<'a, tauri::Wry, tauri::AppHandle> {
  tauri::WebviewWindowBuilder::new(
    handle,
    MAIN_WINDOW_LABEL,
    tauri::WebviewUrl::App(window_relative_url.into()),
  )
  .resizable(true)
  .visible(true)
  .maximizable(false)
  .title(handle.package_info().name.clone())
  .min_inner_size(800.0, 500.0)
  .inner_size(1160.0, 720.0)
  .focused(true)
  .on_page_load(on_page_load_script)
  .disable_drag_drop_handler()
}

#[cfg(target_os = "macos")]
pub fn create_main(
  handle: &tauri::AppHandle,
  window_relative_url: &str,
) -> tauri::Result<tauri::WebviewWindow> {
  tracing::info!("creating window '{MAIN_WINDOW_LABEL}' created at '{window_relative_url}'");

  let window = window_builder(handle, window_relative_url)
    .hidden_title(true)
    .title_bar_style(tauri::TitleBarStyle::Overlay)
    .build()?;

  let scale_factor = window.scale_factor()?;

  window.setup_traffic_lights_inset(tauri::LogicalPosition::new(
    8.0 * scale_factor,
    12.5 * scale_factor,
  ))?;

  window.setup_splashscreen()?;

  let isolated_window = window.clone();
  window.on_window_event(move |e| {
    if let tauri::WindowEvent::ThemeChanged(theme) = e {
      isolated_window
        .eval(format!(
          r#"document.documentElement.setAttribute("data-theme", "{}");"#,
          theme
        ))
        .ok();
    }
  });

  Ok(window)
}

#[cfg(not(target_os = "macos"))]
pub fn create_main(
  handle: &tauri::AppHandle,
  window_relative_url: &str,
) -> tauri::Result<tauri::WebviewWindow> {
  tracing::info!("creating window '{MAIN_WINDOW_LABEL}' created at '{window_relative_url}'");

  let window = window_builder(handle, window_relative_url).build()?;

  let isolated_window = window.clone();
  window.on_window_event(move |e| {
    if let tauri::WindowEvent::ThemeChanged(theme) = e {
      isolated_window
        .eval(format!(
          r#"document.documentElement.setAttribute("data-theme", "{}");"#,
          theme
        ))
        .ok();
    }
  });

  Ok(window)
}
