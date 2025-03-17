mod platform_impl;

pub trait WindowSplashExt {
  fn setup_splashscreen(&self) -> tauri::Result<()>;
  fn revert_splashscreen(&self) -> tauri::Result<()>;
}
