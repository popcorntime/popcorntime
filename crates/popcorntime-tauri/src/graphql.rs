use crate::error::Error;
use popcorntime_graphql_client::{
  add_favorite_provider, client::ApiClient, media, preferences, providers,
  remove_favorite_provider, search, update_preferences,
};
use popcorntime_session::AuthorizationService;
use tauri::State;
use tracing::instrument;

#[tauri::command(async)]
#[instrument(skip(api_client, auth_service), err(Debug))]
pub async fn search_medias(
  api_client: State<'_, ApiClient>,
  auth_service: State<'_, AuthorizationService>,
  params: search::Variables,
) -> Result<Option<search::SearchSearch>, Error> {
  auth_service.validate().await?;

  Ok(api_client.search(&params).await?.map(|data| data.search))
}

#[tauri::command(async)]
#[instrument(skip(api_client, auth_service), err(Debug))]
pub async fn user_preferences(
  api_client: State<'_, ApiClient>,
  auth_service: State<'_, AuthorizationService>,
) -> Result<Option<preferences::PreferencesPreferences>, Error> {
  auth_service.validate().await?;

  let result = api_client
    .preferences(&preferences::Variables {})
    .await?
    .and_then(|data| data.preferences);

  Ok(result)
}

#[tauri::command(async)]
#[instrument(skip(api_client, auth_service), err(Debug))]
pub async fn update_user_preferences(
  api_client: State<'_, ApiClient>,
  auth_service: State<'_, AuthorizationService>,
  params: update_preferences::Variables,
) -> Result<Option<update_preferences::UpdatePreferencesUpdatePreferences>, Error> {
  auth_service.validate().await?;

  let result = api_client
    .update_preferences(&params)
    .await?
    .and_then(|data| data.update_preferences);

  Ok(result)
}

#[tauri::command(async)]
#[instrument(skip(api_client, auth_service), err(Debug))]
pub async fn media(
  api_client: State<'_, ApiClient>,
  auth_service: State<'_, AuthorizationService>,
  params: media::Variables,
) -> Result<Option<media::MediaMedia>, Error> {
  auth_service.validate().await?;

  Ok(api_client.media(&params).await?.and_then(|data| data.media))
}

#[tauri::command(async)]
#[instrument(skip(api_client, auth_service), err(Debug))]
pub async fn providers(
  api_client: State<'_, ApiClient>,
  auth_service: State<'_, AuthorizationService>,
  params: providers::Variables,
) -> Result<Vec<providers::ProvidersProviders>, Error> {
  auth_service.validate().await?;

  let result = api_client
    .providers(&params)
    .await?
    .map(|data| data.providers)
    .unwrap_or_default();

  Ok(result)
}

#[tauri::command(async)]
#[instrument(skip(api_client, auth_service), err(Debug))]
pub async fn remove_favorites_provider(
  api_client: State<'_, ApiClient>,
  auth_service: State<'_, AuthorizationService>,
  params: remove_favorite_provider::Variables,
) -> Result<bool, Error> {
  auth_service.validate().await?;

  let result = api_client
    .remove_favorite_provider(&params)
    .await?
    .map(|data| data.remove_favorite_provider)
    .unwrap_or_default();

  Ok(result)
}

#[tauri::command(async)]
#[instrument(skip(api_client, auth_service), err(Debug))]
pub async fn add_favorites_provider(
  api_client: State<'_, ApiClient>,
  auth_service: State<'_, AuthorizationService>,
  params: add_favorite_provider::Variables,
) -> Result<bool, Error> {
  auth_service.validate().await?;

  let result = api_client
    .add_favorite_provider(&params)
    .await?
    .map(|data| data.add_favorite_provider)
    .unwrap_or_default();

  Ok(result)
}
