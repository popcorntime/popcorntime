use anyhow::Result;
use config::{Config, File};
use notify::{event::ModifyKind, Event, EventKind, RecommendedWatcher, RecursiveMode, Watcher};
use serde::{de::DeserializeOwned, Deserialize, Serialize};
use std::{
  path::{Path, PathBuf},
  sync::{mpsc, Arc, RwLock},
  time::Duration,
};
use tokio::task::spawn_blocking;

const SETTINGS_FILE: &str = "settings.toml";

#[derive(Debug, Clone)]
pub struct SessionStore<S = InnerSessionStore> {
  pub path: PathBuf,
  pub snapshot: Arc<RwLock<S>>,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Clone)]
#[serde(rename_all = "camelCase")]
pub struct InnerSessionStore {
  #[serde(default)]
  pub onboarding_complete: bool,
  #[serde(default)]
  #[serde(skip_serializing_if = "Option::is_none")]
  pub oauth_app: Option<OAuthApp>,
  #[serde(default)]
  pub access_token: Option<String>,
  #[serde(default)]
  #[serde(with = "time::serde::rfc3339::option")]
  pub expires_at: Option<time::OffsetDateTime>,
  #[serde(default)]
  pub refresh_token: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct OAuthApp {
  #[serde(default)]
  pub oauth_client_id: Option<String>,
}

impl InnerSessionStore {
  fn load(path: &Path) -> Result<Self> {
    Config::builder()
      .add_source(File::from(path).required(false))
      .build()?
      .try_deserialize()
      .map_err(Into::into)
  }
}

impl SessionStore<InnerSessionStore> {
  pub fn new(config_dir: &Path) -> Result<Self> {
    let path = config_dir.join(SETTINGS_FILE);
    let inner = InnerSessionStore::load(&path)?;
    let snapshot = Arc::new(RwLock::new(inner));
    Ok(Self { path, snapshot })
  }

  pub fn get(&self) -> Result<InnerSessionStore> {
    let snapshot = self
      .snapshot
      .read()
      .map_err(|_| anyhow::anyhow!("Failed to get settings"))?;
    Ok(snapshot.clone())
  }

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
    self.save()?;
    Ok(())
  }

  pub fn update_access_token(
    &self,
    access_token: String,
    refresh_token: Option<String>,
    expires_in: Option<Duration>,
  ) -> Result<()> {
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
    self.save()?;
    Ok(())
  }

  pub fn delete_access_token(&self) -> Result<()> {
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
    self.save()?;
    Ok(())
  }

  pub fn watch_in_background(
    &self,
    send_event: impl Fn(InnerSessionStore) -> Result<()> + Send + Sync + 'static,
  ) -> Result<()> {
    let (tx, rx) = mpsc::channel();
    let config_path = self.path.clone();
    let watcher_config = notify::Config::default()
      .with_compare_contents(true)
      .with_poll_interval(Duration::from_secs(2));

    // make sure file exist
    if !config_path.exists() {
      std::fs::write(&config_path, "")
        .map_err(|_| anyhow::anyhow!("unable to write settings file"))?;
    }

    // send initial settings
    if let Ok(update) = InnerSessionStore::load(&config_path) {
      tracing::info!("settings.json initialized");
      send_event(update)?;
    }

    let snapshot = self.snapshot.clone();
    spawn_blocking(move || -> Result<()> {
      let mut watcher: RecommendedWatcher = Watcher::new(tx, watcher_config)?;
      watcher.watch(&config_path, RecursiveMode::NonRecursive)?;

      loop {
        match rx.recv() {
          Ok(Ok(Event {
            // windows throw `Any`
            kind: EventKind::Modify(ModifyKind::Any) | EventKind::Modify(ModifyKind::Data(_)),
            ..
          })) => {
            let Ok(mut last_seen_settings) = snapshot.write() else {
              continue;
            };
            if let Ok(update) = InnerSessionStore::load(&config_path) {
              tracing::info!("settings.json modified; refreshing settings");
              *last_seen_settings = update.clone();
              send_event(update)?;
            }
          }

          Err(_) => {
            tracing::error!(
              "Error watching config file {:?} - watcher terminated",
              config_path
            );
            break;
          }

          _ => {
            // Noop
          }
        }
      }

      Ok(())
    });

    Ok(())
  }
}

impl<S: Clone + Serialize + DeserializeOwned> SessionStore<S> {
  pub fn save(&self) -> Result<()> {
    match self.snapshot.read() {
      Ok(settings) => {
        tracing::info!("Saving settings to {:?}", self.path);
        let toml = toml::to_string(&settings.clone()).unwrap();
        std::fs::write(&self.path, toml).map_err(Into::into)
      }
      Err(err) => {
        tracing::error!("Failed to save settings: {:?}", err);
        Err(anyhow::anyhow!("Failed to save settings"))
      }
    }
  }
}
