use crate::error::Error;
use popcorntime_settings::{Settings, SettingsInput, SettingsService};
use tauri::State;
use tracing::instrument;

#[tauri::command(async)]
#[specta::specta]
#[instrument(skip(service), err(Debug))]
pub async fn settings(service: State<'_, SettingsService>) -> Result<Settings, Error> {
  service.get().await.map_err(Into::into)
}

#[tauri::command(async)]
#[specta::specta]
#[instrument(skip(service), err(Debug))]
pub async fn update_settings(
  service: State<'_, SettingsService>,
  settings: SettingsInput,
) -> Result<Settings, Error> {
  service
    .update(|current_settings| {
      if let Some(onboarding_complete) = settings.onboarding_complete {
        current_settings.onboarding_complete = onboarding_complete;
      }

      if let Some(enable_analytics) = settings.enable_analytics {
        current_settings.enable_analytics = enable_analytics;
      }
    })
    .await
    .map_err(Into::into)
}
