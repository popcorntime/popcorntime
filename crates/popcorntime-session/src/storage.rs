use crate::{
  SessionUpdateEvent,
  keyring::{self, SecretBundle},
};
use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::{
  fs,
  path::{Path, PathBuf},
  sync::{Arc, RwLock},
  time::Duration,
};
use tokio::sync::broadcast;

const SETTINGS_FILE: &str = "session.toml";

#[derive(Debug)]
pub struct SessionStore<S = InnerSessionStore> {
  pub path: PathBuf,
  pub snapshot: Arc<RwLock<S>>,
  vault: keyring::KeyringVault,
  tx: Option<broadcast::Sender<SessionUpdateEvent>>,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Clone, Default)]
#[serde(rename_all = "camelCase")]
pub struct InnerSessionStore {
  #[serde(default)]
  pub onboarding_complete: bool,
  #[serde(default)]
  pub access_token: Option<String>,
  #[serde(default)]
  pub refresh_token: Option<String>,
  #[serde(default)]
  #[serde(with = "time::serde::rfc3339::option")]
  pub expires_at: Option<time::OffsetDateTime>,
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct OAuthApp {
  #[serde(default)]
  pub oauth_client_id: Option<String>,
}

impl InnerSessionStore {
  fn load_without_secrets(path: &Path) -> Result<Self> {
    let file_str = fs::read(path);
    match file_str {
      Ok(s) => {
        toml::from_slice(&s).map_err(|err| anyhow::anyhow!("Failed to parse settings: {:?}", err))
      }
      Err(err) => {
        if err.kind() == std::io::ErrorKind::NotFound {
          Ok(Default::default())
        } else {
          Err(anyhow::anyhow!("Failed to read settings: {:?}", err))
        }
      }
    }
  }
}

impl SessionStore<InnerSessionStore> {
  pub fn new(config_dir: &Path, namespace: &str) -> Result<Self> {
    let path = config_dir.join(SETTINGS_FILE);
    let mut inner = InnerSessionStore::load_without_secrets(&path)?;
    let vault = keyring::KeyringVault::new(namespace)?;

    let SecretBundle {
      access_token,
      refresh_token,
    } = vault.get()?;
    inner.access_token = access_token;
    inner.refresh_token = refresh_token;

    let snapshot = Arc::new(RwLock::new(inner));
    Ok(Self {
      path,
      snapshot,
      vault,
      tx: None,
    })
  }

  pub fn with_broadcast(mut self, tx: broadcast::Sender<SessionUpdateEvent>) -> Self {
    self.tx = Some(tx);
    self
  }

  pub fn get_with_secrets(&self) -> Result<InnerSessionStore> {
    let snapshot = self
      .snapshot
      .read()
      .map_err(|_| anyhow::anyhow!("Failed to get settings"))?;

    Ok(snapshot.clone())
  }

  // FIXME: remove
  pub fn update_onboarding_complete(&self, update: bool) -> Result<()> {
    match self.snapshot.write() {
      Ok(mut settings) => {
        settings.onboarding_complete = update;
      }
      Err(err) => {
        tracing::error!("Failed to update onboarding_complete: {:?}", err);
        return Err(anyhow::anyhow!("Failed to update onboarding_complete"));
      }
    }
    self.save_and_signal()?;
    Ok(())
  }

  pub(crate) fn update_access_token(
    &self,
    access_token: String,
    refresh_token: Option<String>,
    expires_in: Option<Duration>,
  ) -> Result<()> {
    self.vault.set(SecretBundle {
      access_token: Some(access_token.clone()),
      refresh_token: refresh_token.clone(),
    })?;

    tracing::info!("Updating access_token in memory");

    match self.snapshot.write() {
      Ok(mut settings) => {
        settings.access_token = Some(access_token);
        // overwrite only if they are provided
        if refresh_token.is_some() {
          settings.refresh_token = refresh_token;
        }
        // overwrite only if they are provided
        if let Some(expires_in) = expires_in {
          settings.expires_at = Some(time::OffsetDateTime::now_utc() + expires_in);
        }
      }
      Err(err) => {
        tracing::error!("Failed to update access_token: {:?}", err);
        return Err(anyhow::anyhow!("Failed to update access_token"));
      }
    }
    self.save_and_signal()?;
    Ok(())
  }

  pub fn delete_access_token(&self) -> Result<()> {
    self.vault.delete()?;

    match self.snapshot.write() {
      Ok(mut settings) => {
        settings.access_token = None;
        settings.refresh_token = None;
        settings.expires_at = None;
      }
      Err(err) => {
        tracing::error!("Failed to delete access_token: {:?}", err);
        return Err(anyhow::anyhow!("Failed to delete access_token"));
      }
    }
    self.save_and_signal()?;
    Ok(())
  }
}

impl SessionStore<InnerSessionStore> {
  pub fn save_and_signal(&self) -> Result<()> {
    match self.snapshot.read() {
      Ok(settings) => {
        tracing::info!("Saving settings to {:?}", self.path);

        // make sure we don't write secrets to disk
        let mut tmp = settings.clone();
        tmp.access_token = None;
        tmp.refresh_token = None;

        let toml = toml::to_string(&tmp)?;
        std::fs::write(&self.path, toml)?;

        // signal update
        if let Some(tx) = &self.tx {
          tracing::info!("Signaling settings update");
          if tx
            .send(SessionUpdateEvent {
              access_token: settings.access_token.clone(),
              refresh_token: settings.refresh_token.clone(),
              expires_at: settings.expires_at,
            })
            .is_err()
          {
            // we don't attach error to prevent leaking any access token
            tracing::error!("Failed to send update signal");
          }
        }

        Ok(())
      }
      Err(err) => {
        tracing::error!("Failed to save settings: {:?}", err);
        Err(anyhow::anyhow!("Failed to save settings"))
      }
    }
  }
}
