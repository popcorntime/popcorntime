use anyhow::{Context, Result};
use popcorntime_error::Code;
use std::sync::Arc;

use crate::jwks::JwksClient;
#[derive(Debug, Clone)]
pub struct AppSession {
  jwks_client: Arc<JwksClient>,
  access_token: Option<String>,
  expires_at: Option<time::OffsetDateTime>,
  refresh_token: Option<String>,
}

impl AppSession {
  pub fn new(auth_server: &str) -> Result<Self> {
    let jwks_client = JwksClient::new(auth_server);

    Ok(Self {
      access_token: None,
      expires_at: None,
      refresh_token: None,
      jwks_client: Arc::new(jwks_client),
    })
  }

  pub fn access_token(&self) -> Option<String> {
    self.access_token.clone()
  }

  pub fn refresh_token(&self) -> Option<String> {
    self.refresh_token.clone()
  }

  pub fn with_access_token(&mut self, access_token: Option<String>) {
    if access_token == self.access_token {
      return;
    }
    self.access_token = access_token;
  }

  pub fn with_refresh_token(&mut self, refresh_token: Option<String>) {
    if refresh_token == self.refresh_token {
      return;
    }
    self.refresh_token = refresh_token;
  }

  pub fn with_expires_at(&mut self, expires_at: Option<time::OffsetDateTime>) {
    if expires_at == self.expires_at {
      return;
    }
    self.expires_at = expires_at;
  }

  pub async fn validate(&self) -> Result<()> {
    if let Some(access_token) = &self.access_token {
      self
        .jwks_client
        .validate_token(access_token)
        .await
        .context(Code::InvalidSession)?;
      return Ok(());
    }

    Err(anyhow::anyhow!("No access token found").context(Code::InvalidSession))
  }
}
