use anyhow::{Ok, Result};
use serde::{Deserialize, Serialize};
use specta::Type;
use std::{
  path::{Path, PathBuf},
  sync::Arc,
};
use tokio::sync::RwLock;

const SETTINGS_FILE: &str = "settings.toml";

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Clone, Default, Type)]
#[serde(rename_all = "camelCase")]
pub struct Settings {
  #[serde(default)]
  pub onboarding_complete: bool,
  #[serde(default)]
  pub enable_analytics: bool,
  #[serde(default)]
  pub tos_accepted: bool,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Clone, Default, Type)]
#[serde(rename_all = "camelCase")]
pub struct SettingsInput {
  #[serde(default)]
  pub onboarding_complete: Option<bool>,
  #[serde(default)]
  pub enable_analytics: Option<bool>,
  #[serde(default)]
  pub tos_accepted: Option<bool>,
}

#[derive(Debug)]
pub struct SettingsService {
  snapshot: Arc<RwLock<Settings>>,
  config_dir: PathBuf,
}

fn read_snapshot(path: &Path) -> Result<Settings> {
  if path.exists() {
    let content = std::fs::read_to_string(path)?;
    let settings: Settings = toml::from_str(&content)?;
    Ok(settings)
  } else {
    Ok(Settings::default())
  }
}

impl SettingsService {
  pub fn new(config_dir: &Path) -> Result<Self> {
    let snapshot = read_snapshot(&config_dir.join(SETTINGS_FILE))?;
    Ok(Self {
      snapshot: Arc::new(RwLock::new(snapshot)),
      config_dir: config_dir.to_path_buf(),
    })
  }

  pub async fn get(&self) -> Result<Settings> {
    Ok(self.snapshot.read().await.clone())
  }

  pub async fn update<F>(&self, f: F) -> Result<Settings>
  where
    F: FnOnce(&mut Settings),
  {
    let mut settings = self.snapshot.write().await;

    f(&mut settings);

    if !self.config_dir.exists() {
      std::fs::create_dir_all(&self.config_dir)?;
    }

    let path = self.config_dir.join(SETTINGS_FILE);
    let settings_inner = settings.clone();
    let content = toml::to_string_pretty(&settings_inner)?;
    std::fs::write(path, content)?;

    Ok(settings_inner)
  }
}
