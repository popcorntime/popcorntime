use serde::Serialize;
use tauri::{AppHandle, Manager};

#[derive(Serialize)]
struct OpenerPluginPathEntry {
  path: String,
}

pub fn setup(app_handle: &AppHandle) -> tauri::Result<()> {
  let logs_dir = app_handle
    .path()
    .app_log_dir()
    .expect("failed to get logs dir");

  app_handle.add_capability(
    tauri::ipc::CapabilityBuilder::new("open-paths")
      .window("main")
      .permission_scoped(
        "opener:allow-open-path",
        vec![OpenerPluginPathEntry {
          path: logs_dir.to_str().expect("qed; valid dir").to_string(),
        }],
        vec![],
      ),
  )
}
