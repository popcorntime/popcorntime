use crate::error::Error;
use popcorntime_settings::{AppHandleSettingsExt, Settings, SettingsInput};
use tauri::{AppHandle, State};
use tracing::instrument;

#[tauri::command(async)]
#[specta::specta]
#[instrument(skip(settings), err(Debug))]
pub async fn settings(settings: State<'_, Settings>) -> Result<Settings, Error> {
  Ok(settings.inner().clone())
}

#[tauri::command(async)]
#[specta::specta]
#[instrument(skip(app_handle), err(Debug))]
pub async fn update_settings(
  app_handle: AppHandle,
  settings: SettingsInput,
) -> Result<Settings, Error> {
  app_handle
    .settings_update(|current_settings| {
      if let Some(onboarding_complete) = settings.onboarding_complete {
        current_settings.onboarding_complete = onboarding_complete;
      }

      if let Some(enable_analytics) = settings.enable_analytics {
        current_settings.enable_analytics = enable_analytics;
      }
    })
    .map_err(Into::into)
}
