use crate::consts::GRAPHQL_SERVER;
use anyhow::Result;
use graphql_client::{QueryBody, Response};
use reqwest::header;
use serde::{de::DeserializeOwned, Serialize};
use std::{fmt::Debug, sync::Arc, time::Duration};
use tokio::{runtime::Handle, sync::Mutex};

static USER_AGENT: &str = concat!(env!("CARGO_PKG_NAME"), "/", env!("CARGO_PKG_VERSION"),);

#[derive(Clone)]
pub struct ApiClient {
  client: Arc<Mutex<reqwest::Client>>,
  url: String,
}

impl Debug for ApiClient {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    write!(f, "ApiClient")
  }
}

pub fn build_client(access_token: Option<String>) -> Result<reqwest::Client> {
  let mut headers = header::HeaderMap::new();

  if let Some(access_token) = access_token {
    let mut auth_value = header::HeaderValue::from_str(&format!("Bearer {}", access_token))?;
    auth_value.set_sensitive(true);
    headers.insert(header::AUTHORIZATION, auth_value);
  }

  reqwest::ClientBuilder::new()
    .default_headers(headers)
    .user_agent(USER_AGENT)
    .timeout(Duration::from_secs(5))
    .build()
    .map_err(Into::into)
}

impl ApiClient {
  pub fn new(access_token: Option<String>) -> Result<Self> {
    let client = build_client(access_token)?;
    Ok(Self {
      url: GRAPHQL_SERVER.to_string(),
      client: Arc::new(Mutex::new(client)),
    })
  }

  pub async fn query<T: Serialize, R: DeserializeOwned>(
    &self,
    params: &QueryBody<T>,
    disable_cache: bool,
  ) -> anyhow::Result<Response<R>> {
    let res = self.post(disable_cache).await.json(params).send().await?;
    res.json().await.map_err(Into::into)
  }

  async fn post(&self, disable_cache: bool) -> reqwest::RequestBuilder {
    if disable_cache {
      self
        .client
        .lock()
        .await
        .post(&self.url)
        .header("Cache-Control", "no-cache")
    } else {
      self.client.lock().await.post(&self.url)
    }
  }

  // this run in the `watch_config_in_background` thread
  pub fn update_access_token(&self, access_token: Option<String>) -> Result<()> {
    tokio::task::block_in_place(move || {
      Handle::current().block_on(async move {
        let mut client = self.client.lock().await;
        if let Ok(new_client) = build_client(access_token) {
          *client = new_client;
        }
        Ok(())
      })
    })
  }
}
