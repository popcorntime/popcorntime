use anyhow::Result;
use serde::{Deserialize, Serialize};
use specta::Type;
use tauri::Manager;

const SETTINGS_FILE: &str = "settings.toml";

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Clone, Default, Type)]
#[serde(rename_all = "camelCase")]
pub struct Settings {
  #[serde(default)]
  pub onboarding_complete: bool,
  #[serde(default)]
  pub enable_analytics: bool,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Clone, Default, Type)]
#[serde(rename_all = "camelCase")]
pub struct SettingsInput {
  #[serde(default)]
  pub onboarding_complete: Option<bool>,
  #[serde(default)]
  pub enable_analytics: Option<bool>,
}

pub trait AppHandleSettingsExt {
  fn settings_load_in_state(&self) -> Result<()>;
  fn settings_update<F>(&self, f: F) -> Result<Settings>
  where
    F: FnOnce(&mut Settings);
}

impl AppHandleSettingsExt for tauri::AppHandle {
  fn settings_load_in_state(&self) -> Result<()> {
    let path = self.path().app_config_dir()?.join(SETTINGS_FILE);

    let settings: Settings = if path.exists() {
      let content = std::fs::read_to_string(&path)?;
      toml::from_str(&content)?
    } else {
      Settings::default()
    };

    self.manage(settings.clone());

    Ok(())
  }

  fn settings_update<F>(&self, f: F) -> Result<Settings>
  where
    F: FnOnce(&mut Settings),
  {
    let mut settings = if let Some(s) = self.try_state::<Settings>() {
      s.inner().clone()
    } else {
      Settings::default()
    };

    f(&mut settings);

    let config_dir = self.path().app_config_dir()?;

    if !config_dir.exists() {
      std::fs::create_dir_all(&config_dir)?;
    }

    let path = config_dir.join(SETTINGS_FILE);
    let content = toml::to_string_pretty(&settings)?;
    std::fs::write(path, content)?;

    self.manage(settings.clone());

    Ok(settings)
  }
}
