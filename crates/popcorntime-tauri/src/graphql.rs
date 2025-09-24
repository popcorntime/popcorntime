use crate::error::Error;
use cynic::{MutationBuilder, QueryBuilder};
use popcorntime_graphql_client::{client::ApiClient, media, preferences, providers, search};
use popcorntime_session::AuthorizationService;
use tauri::State;
use tracing::instrument;

#[tauri::command(async)]
#[specta::specta]
#[instrument(skip(api_client, auth_service), err(Debug))]
pub async fn search_medias<'a>(
  api_client: State<'_, ApiClient>,
  auth_service: State<'_, AuthorizationService>,
  params: search::SearchInput<'a>,
) -> Result<Option<search::SearchOutput>, Error> {
  auth_service.validate().await?;

  api_client
    .query(search::SearchOutput::build(params), false)
    .await
    .map(|res| res.data)
    .map_err(Into::into)
}

#[tauri::command(async)]
#[specta::specta]
#[instrument(skip(api_client, auth_service), err(Debug))]
pub async fn user_preferences(
  api_client: State<'_, ApiClient>,
  auth_service: State<'_, AuthorizationService>,
) -> Result<Option<preferences::PreferencesOutput>, Error> {
  auth_service.validate().await?;

  api_client
    .query(preferences::PreferencesOutput::build(()), true)
    .await
    .map(|res| res.data)
    .map_err(Into::into)
}

#[tauri::command(async)]
#[specta::specta]
#[instrument(skip(api_client, auth_service), err(Debug))]
pub async fn update_user_preferences(
  api_client: State<'_, ApiClient>,
  auth_service: State<'_, AuthorizationService>,
  params: preferences::UpdatePreferencesInput,
) -> Result<Option<preferences::UpdatePreferencesMutation>, Error> {
  auth_service.validate().await?;

  api_client
    .query(preferences::UpdatePreferencesMutation::build(params), true)
    .await
    .map(|res| res.data)
    .map_err(Into::into)
}

#[tauri::command(async)]
#[specta::specta]
#[instrument(skip(api_client, auth_service), err(Debug))]
pub async fn media<'a>(
  api_client: State<'_, ApiClient>,
  auth_service: State<'_, AuthorizationService>,
  params: media::MediaInput<'a>,
) -> Result<Option<media::MediaOutput>, Error> {
  auth_service.validate().await?;

  api_client
    .query(media::MediaOutput::build(params), false)
    .await
    .map(|res| res.data)
    .map_err(Into::into)
}

#[tauri::command(async)]
#[specta::specta]
#[instrument(skip(api_client, auth_service), err(Debug))]
pub async fn providers<'a>(
  api_client: State<'_, ApiClient>,
  auth_service: State<'_, AuthorizationService>,
  params: providers::ProvidersInput<'a>,
) -> Result<Option<providers::ProvidersOutput>, Error> {
  auth_service.validate().await?;
  let skip_cache = params.favorites.unwrap_or(false);

  api_client
    .query(providers::ProvidersOutput::build(params), skip_cache)
    .await
    .map(|res| res.data)
    .map_err(Into::into)
}

#[tauri::command(async)]
#[specta::specta]
#[instrument(skip(api_client, auth_service), err(Debug))]
pub async fn remove_favorites_provider<'a>(
  api_client: State<'_, ApiClient>,
  auth_service: State<'_, AuthorizationService>,
  params: providers::RemoveFavoriteProviderInput<'a>,
) -> Result<Option<providers::RemoveFavoriteProviderMutation>, Error> {
  auth_service.validate().await?;

  api_client
    .query(
      providers::RemoveFavoriteProviderMutation::build(params),
      true,
    )
    .await
    .map(|res| res.data)
    .map_err(Into::into)
}

#[tauri::command(async)]
#[specta::specta]
#[instrument(skip(api_client, auth_service), err(Debug))]
pub async fn add_favorites_provider<'a>(
  api_client: State<'_, ApiClient>,
  auth_service: State<'_, AuthorizationService>,
  params: providers::AddFavoriteProviderInput<'a>,
) -> Result<Option<providers::AddFavoriteProviderMutation>, Error> {
  auth_service.validate().await?;

  api_client
    .query(providers::AddFavoriteProviderMutation::build(params), true)
    .await
    .map(|res| res.data)
    .map_err(Into::into)
}
