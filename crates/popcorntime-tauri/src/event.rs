use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Default, Clone, specta::Type, tauri_specta::Event)]
pub struct SessionUpdate;

#[derive(Serialize, Deserialize, Default, Clone, specta::Type, tauri_specta::Event)]
pub struct SessionServerReady {
  pub authorization_url: String,
}
