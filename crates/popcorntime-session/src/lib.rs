use anyhow::{Context, Result};
use authorization::{AuthorizationBroker, AuthorizationBrokerEvent, AuthorizationBrokerResponse};
use consts::{AUTH_SERVER, CLIENT_ID};
use popcorntime_error::Code;
use serde::Serialize;
use session::AppSession;
use std::{path::Path, sync::Arc};
use storage::{InnerSessionStore, SessionStore};
use tokio::sync::RwLock;

pub mod authorization;
pub mod consts;
pub mod jwks;
mod server;
pub mod session;
pub mod storage;

#[derive(Debug, Clone)]
pub struct AuthorizationService {
  broker: Arc<AuthorizationBroker>,
  store: Arc<SessionStore>,
  snapshot: Arc<RwLock<AppSession>>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Settings {
  pub onboarded: bool,
  pub enable_analytics: bool,
}

impl AuthorizationService {
  pub fn new(storage_dir: &Path) -> Result<Self> {
    let store = SessionStore::new(storage_dir)?;
    let broker = AuthorizationBroker::new(CLIENT_ID, AUTH_SERVER)?;
    let mut current_session = AppSession::new(&format!("{}/.well-known/jwks.json", AUTH_SERVER))?;

    let current_store = store.get()?;
    current_session.with_access_token(current_store.access_token.clone());
    current_session.with_refresh_token(current_store.refresh_token.clone());
    current_session.with_expires_at(current_store.expires_at);
    Ok(Self {
      broker: Arc::new(broker),
      store: Arc::new(store),
      snapshot: Arc::new(RwLock::new(current_session)),
    })
  }

  /// Watch the config file in the background and update the session store
  /// - send initial value on-start
  /// - send updated value on-write
  pub fn watch_config_in_background(
    &self,
    send_event: impl Fn(InnerSessionStore) -> Result<()> + Send + Sync + 'static,
  ) -> Result<()> {
    let snapshot = self.snapshot.clone();
    self.store.watch_in_background(move |session| {
      // async update
      let snapshot_isolated = snapshot.clone();
      let session_isolated = session.clone();
      tokio::spawn(async move {
        let mut inner = snapshot_isolated.write().await;
        inner.with_access_token(session_isolated.access_token.clone());
        inner.with_refresh_token(session_isolated.refresh_token.clone());
        inner.with_expires_at(session_isolated.expires_at);
      });

      send_event(session)
    })
  }

  pub async fn authorize_in_background(
    &self,
    on_ready: impl Fn(AuthorizationBrokerEvent) -> Result<()> + Send + Sync + 'static,
  ) -> Result<()> {
    let inner_settings = self.store.clone();
    self
      .broker
      .authorize_in_background(on_ready, move |token| {
        if let Err(err) = inner_settings.update_access_token(
          token.access_token,
          Some(token.refresh_token),
          token.expires_in,
        ) {
          tracing::error!("Failed to update access_token: {:?}", err);
        };

        Ok(())
      })
      .await
  }

  pub fn settings(&self) -> Result<Settings> {
    let inner_settings = self.store.clone();
    inner_settings
      .snapshot
      .read()
      .ok()
      .map(|s| Settings {
        onboarded: s.onboarding_complete,
        enable_analytics: s.enable_analytics,
      })
      .ok_or_else(|| anyhow::anyhow!("Failed to get settings").context(Code::Unknown))
  }

  pub fn set_onboarded(&self, onboarded: bool) -> Result<()> {
    let inner_settings = self.store.clone();
    inner_settings.update_onboarding_complete(onboarded)
  }

  pub fn is_analytics_enabled(&self) -> Result<bool> {
    let inner_settings = self.store.clone();
    Ok(
      inner_settings
        .snapshot
        .read()
        .is_ok_and(|s| s.enable_analytics),
    )
  }

  pub fn set_enable_analytics(&self, allow: bool) -> Result<()> {
    let inner_settings = self.store.clone();
    inner_settings.update_enable_analytics(allow)
  }

  pub async fn validate(&self) -> Result<()> {
    let mut session = self.snapshot.write().await;
    let inner_settings = self.store.clone();

    match session.validate().await {
      Ok(_) => Ok(()),
      Err(err) => {
        // probably expired token
        if err.is::<Code>() {
          tracing::info!("Refreshing token");
          let AuthorizationBrokerResponse {
            access_token,
            expires_in,
            refresh_token,
          } = self
            .broker
            .exchange_refresh_token(&session)
            .await
            .context(Code::InvalidSession)?;

          // update storage -- a `AppSession` will be updated in the background
          if let Err(err) = inner_settings.update_access_token(
            access_token.clone(),
            Some(refresh_token),
            expires_in,
          ) {
            tracing::error!("Failed to update access_token: {:?}", err);
          };

          // make sure the access token is updated
          // we dont want to relay on the watch_in_background to update the session
          session.with_access_token(Some(access_token));

          return session.validate().await;
        }
        Err(err)
      }
    }
  }

  pub async fn logout(&self) -> Result<()> {
    self.store.delete_access_token()
  }
}
