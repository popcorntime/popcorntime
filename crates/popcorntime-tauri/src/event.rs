use anyhow::{Context, Result};
use popcorntime_session::{authorization::AuthorizationBrokerEvent, storage::InnerSessionStore};
use serde_json::Value;
use tauri::Emitter;
use tauri_plugin_deep_link::OpenUrlEvent;

const EVENT_SESSION_UPDATE: &str = "popcorntime://session_update";
const EVENT_SESSION_SERVER_READY: &str = "popcorntime://session_server_ready";

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct FrontendEvent {
  name: String,
  payload: serde_json::Value,
}

impl FrontendEvent {
  pub fn send(&self, app_handle: &tauri::AppHandle) -> Result<()> {
    app_handle
      .emit(&self.name, Some(&self.payload))
      .context("emit event")?;
    Ok(())
  }
}

impl From<InnerSessionStore> for FrontendEvent {
  fn from(_config: InnerSessionStore) -> Self {
    FrontendEvent {
      name: EVENT_SESSION_UPDATE.to_string(),
      payload: Value::Null,
    }
  }
}

impl From<AuthorizationBrokerEvent> for FrontendEvent {
  fn from(event: AuthorizationBrokerEvent) -> Self {
    tracing::debug!(?event);
    FrontendEvent {
      name: EVENT_SESSION_SERVER_READY.to_string(),
      payload: serde_json::json!(event),
    }
  }
}

impl From<OpenUrlEvent> for FrontendEvent {
  fn from(_event: OpenUrlEvent) -> Self {
    // fixme: better URI parsing
    // to update zustand state
    FrontendEvent {
      name: EVENT_SESSION_UPDATE.to_string(),
      payload: Value::Null,
    }
  }
}
