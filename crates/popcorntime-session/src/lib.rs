use anyhow::{Context, Result};
use authorization::{AuthorizationBroker, AuthorizationBrokerEvent, AuthorizationBrokerResponse};
use consts::{AUTH_SERVER, CLIENT_ID};
use oauth2::RefreshToken;
use popcorntime_error::Code;
use session::AppSession;
use std::{path::Path, sync::Arc};
use storage::SessionStore;
use tokio::sync::{Mutex, RwLock, broadcast};

pub mod authorization;
pub mod consts;
pub mod jwks;
mod keyring;
mod server;
pub mod session;
pub mod storage;

#[derive(Clone)]
pub struct SessionUpdateEvent {
  pub access_token: Option<String>,
  pub refresh_token: Option<String>,
  pub expires_at: Option<time::OffsetDateTime>,
}

#[derive(Debug)]
pub struct AuthorizationService {
  broker: Arc<AuthorizationBroker>,
  store: Arc<SessionStore>,
  snapshot: Arc<RwLock<AppSession>>,
  refresh_gate: Arc<Mutex<()>>,
  rx: broadcast::Receiver<SessionUpdateEvent>,
}

impl AuthorizationService {
  pub fn new(storage_dir: &Path, namespace: &str) -> Result<Self> {
    let (tx, rx) = broadcast::channel(16);
    let store = SessionStore::new(storage_dir, namespace)?.with_broadcast(tx);
    let broker = AuthorizationBroker::new(CLIENT_ID, AUTH_SERVER)?;
    let current_store = store.get_with_secrets()?;
    let current_session = AppSession::new(&format!("{}/.well-known/jwks.json", AUTH_SERVER))?
      .with_access_token(current_store.access_token.clone())
      .with_refresh_token(current_store.refresh_token.clone())
      .with_expires_at(current_store.expires_at);

    Ok(Self {
      broker: Arc::new(broker),
      store: Arc::new(store),
      snapshot: Arc::new(RwLock::new(current_session)),
      refresh_gate: Arc::new(Mutex::new(())),
      rx,
    })
  }

  pub fn on_access_token_update(
    &self,
    send_event: impl Fn(SessionUpdateEvent) -> Result<()> + Send + Sync + 'static,
  ) -> Result<()> {
    // resubscribe to get a fully isolated receiver
    let mut rx = self.rx.resubscribe();
    let snapshot = self.snapshot.clone();
    tokio::spawn(async move {
      let snapshot_isolated = snapshot.clone();

      loop {
        match rx.recv().await {
          Ok(event) => {
            // rebuild the inner session
            let mut current_session = snapshot_isolated.write().await;
            *current_session = current_session
              .clone()
              .with_access_token(event.access_token.clone())
              .with_refresh_token(event.refresh_token.clone())
              .with_expires_at(event.expires_at);

            // send the event
            if let Err(err) = send_event(event) {
              tracing::error!("Failed to send session update event: {:?}", err);
            }
          }
          Err(broadcast::error::RecvError::Lagged(_)) => continue,
          Err(broadcast::error::RecvError::Closed) => break,
        }
      }
    });

    Ok(())
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

  pub fn is_onboarded(&self) -> Result<bool> {
    let inner_settings = self.store.clone();
    Ok(
      inner_settings
        .snapshot
        .read()
        .is_ok_and(|s| s.onboarding_complete),
    )
  }

  /// Try to get the current access token
  /// Locks may fail, so this may return None even if there is an access token
  /// We currently only use this at startup to initialize the API client
  /// It should be fine as there is no concurrency at that point
  pub fn try_access_token(&self) -> Option<String> {
    self.snapshot.try_read().ok().and_then(|s| s.access_token())
  }

  pub fn set_onboarded(&self, onboarded: bool) -> Result<()> {
    let inner_settings = self.store.clone();
    inner_settings.update_onboarding_complete(onboarded)
  }

  async fn fast_validate(&self) -> Result<()> {
    let session = self.snapshot.read().await;
    if session.validate().await.is_ok() {
      return Ok(());
    }

    Err(anyhow::anyhow!("No valid access token found").context(Code::InvalidSession))
  }

  pub async fn validate(&self) -> Result<()> {
    // fast path
    if self.fast_validate().await.is_ok() {
      return Ok(());
    }

    // prevent multiple validate
    let _guard = self.refresh_gate.lock().await;

    // if we were running in a lock
    // another thread may have refreshed the token
    if self.fast_validate().await.is_ok() {
      return Ok(());
    }

    let refresh_input = { self.snapshot.read().await.refresh_token() }
      .ok_or_else(|| anyhow::anyhow!("No valid tokens found").context(Code::InvalidSession))?;

    let AuthorizationBrokerResponse {
      access_token,
      expires_in,
      refresh_token,
    } = self
      .broker
      .exchange_refresh_token(&RefreshToken::new(refresh_input))
      .await
      .context(Code::InvalidSession)?;

    if let Err(err) = self.store.update_access_token(
      access_token.clone(),
      Some(refresh_token.clone()),
      expires_in,
    ) {
      tracing::error!("Failed to update_access_token: {err:?}");
    }

    self.fast_validate().await
  }

  pub async fn logout(&self) -> Result<()> {
    self.store.delete_access_token()
  }
}
