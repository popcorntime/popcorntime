use anyhow::{Context, Result};
use core::fmt;
use keyring::{Credential, default::default_credential_builder};
use popcorntime_error::Code;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::RwLock;

const SERVICE: &str = "Popcorn Time";

#[derive(Clone, Serialize, Deserialize, Default)]
pub struct SecretBundle {
  pub access_token: Option<String>,
  pub refresh_token: Option<String>,
}

impl fmt::Debug for SecretBundle {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    f.debug_struct("SecretBundle")
      .field("access_token", &self.access_token.as_ref().map(|_| "****"))
      .field(
        "refresh_token",
        &self.refresh_token.as_ref().map(|_| "****"),
      )
      .finish()
  }
}

#[derive(Debug)]
pub struct KeyringVault {
  credential: Box<Credential>,
  cache: Arc<RwLock<Option<SecretBundle>>>,
}

impl KeyringVault {
  pub fn new(namespace: &str) -> Result<Self> {
    let credential = default_credential_builder().build(None, SERVICE, namespace)?;
    Ok(Self {
      credential,
      cache: Arc::new(RwLock::new(None)),
    })
  }

  pub fn get(&self) -> Result<SecretBundle> {
    match self.credential.get_secret() {
      Ok(s) => {
        let bundle: SecretBundle = serde_json::from_slice(&s)?;
        self.cache.try_write()?.replace(bundle.clone());
        Ok(bundle)
      }
      Err(keyring::Error::NoEntry) => Ok(SecretBundle::default()),
      Err(e) => Err(e).context(Code::InvalidSessionKeyring),
    }
  }

  pub fn set(&self, bundle: SecretBundle) -> Result<()> {
    let bundled = serde_json::to_vec(&bundle)?;
    self.credential.set_secret(&bundled).map_err(Into::into)
  }

  pub fn delete(&self) -> Result<()> {
    self.credential.delete_credential().map_err(Into::into)
  }
}
