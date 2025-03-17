use crate::WindowSplashExt;
use tauri::{Runtime, WebviewWindow};

impl<R: Runtime> WindowSplashExt for WebviewWindow<R> {
  fn setup_splashscreen(&self) -> tauri::Result<()> {
    unimplemented!()
  }

  fn revert_splashscreen(&self) -> tauri::Result<()> {
    unimplemented!()
  }
}
