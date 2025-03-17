use crate::{error::Error, event::FrontendEvent};
use popcorntime_session::AuthorizationService;
use tauri::State;
use tracing::instrument;

#[tauri::command(async)]
#[instrument(skip(handle, service), err(Debug))]
pub async fn initialize_session_authorization(
  handle: tauri::AppHandle,
  service: State<'_, AuthorizationService>,
) -> Result<(), Error> {
  service
    .authorize_in_background(move |event| FrontendEvent::from(event).send(&handle))
    .await?;

  Ok(())
}

#[tauri::command(async)]
#[instrument(skip(service), err(Debug))]
pub async fn validate(service: State<'_, AuthorizationService>) -> Result<(), Error> {
  service.validate().await.map_err(Into::into)
}

#[tauri::command(async)]
#[instrument(skip(service), err(Debug))]
pub async fn is_onboarded(service: State<'_, AuthorizationService>) -> Result<bool, Error> {
  service.is_onboarded().map_err(Into::into)
}

#[tauri::command(async)]
#[instrument(skip(service), err(Debug))]
pub async fn set_onboarded(service: State<'_, AuthorizationService>) -> Result<(), Error> {
  service.set_onboarded(true).map_err(Into::into)
}

#[tauri::command(async)]
#[instrument(skip(service), err(Debug))]
pub async fn logout(service: State<'_, AuthorizationService>) -> Result<(), Error> {
  service.logout().await.map_err(Into::into)
}
