use crate::error::Error;
use cynic::{MutationBuilder, QueryBuilder};
use popcorntime_graphql_client::{
  client::ApiClient, media, preferences, providers, reactions, search,
};
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

  // cache is disabled because this query include user reaction that can change
  api_client
    .query(media::MediaOutput::build(params), true)
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

  // FIXME: we can't cache this query as it include the favs
  api_client
    .query(providers::ProvidersOutput::build(params), true)
    .await
    .map(|res| res.data)
    .map_err(Into::into)
}

#[tauri::command(async)]
#[specta::specta]
#[instrument(skip(api_client, auth_service), err(Debug))]
pub async fn set_favorites_provider<'a>(
  api_client: State<'_, ApiClient>,
  auth_service: State<'_, AuthorizationService>,
  params: providers::SetFavoriteProviderInput<'a>,
) -> Result<Option<providers::SetFavoriteProviderMutation>, Error> {
  auth_service.validate().await?;

  api_client
    .query(providers::SetFavoriteProviderMutation::build(params), true)
    .await
    .map(|res| res.data)
    .map_err(Into::into)
}

#[tauri::command(async)]
#[specta::specta]
#[instrument(skip(api_client, auth_service), err(Debug))]
pub async fn set_favorites_multiple_providers(
  api_client: State<'_, ApiClient>,
  auth_service: State<'_, AuthorizationService>,
  params: providers::SetFavoriteMultipleProvidersInput,
) -> Result<Option<providers::SetFavoriteMultipleProvidersMutation>, Error> {
  auth_service.validate().await?;

  api_client
    .query(
      providers::SetFavoriteMultipleProvidersMutation::build(params),
      true,
    )
    .await
    .map(|res| res.data)
    .map_err(Into::into)
}

#[tauri::command(async)]
#[specta::specta]
#[instrument(skip(api_client, auth_service), err(Debug))]
pub async fn set_media_reaction(
  api_client: State<'_, ApiClient>,
  auth_service: State<'_, AuthorizationService>,
  params: reactions::SetReactionInput,
) -> Result<Option<reactions::SetReactionMutation>, Error> {
  auth_service.validate().await?;

  api_client
    .query(reactions::SetReactionMutation::build(params), true)
    .await
    .map(|res| res.data)
    .map_err(Into::into)
}
