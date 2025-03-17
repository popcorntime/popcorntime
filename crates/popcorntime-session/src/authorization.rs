use anyhow::Result;
use oauth2::basic::{BasicClient, BasicTokenType};
use oauth2::{
  reqwest, AuthorizationCode, CsrfToken, EmptyExtraTokenFields, PkceCodeChallenge, RefreshToken,
  Scope, StandardTokenResponse, TokenResponse,
};
use oauth2::{AuthUrl, ClientId, RedirectUrl, TokenUrl};
use serde::{Deserialize, Serialize};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::time::Duration;
use tokio::sync::mpsc;
use tokio::time::timeout;
use url::Url;

use crate::server::run_local_oauth_server;
use crate::session::AppSession;

const PORT: u16 = 8085;
// Thread timeout in seconds
const THREAD_TIMEOUT: u64 = 300;

pub type HydraClient = oauth2::Client<
  oauth2::StandardErrorResponse<oauth2::basic::BasicErrorResponseType>,
  oauth2::StandardTokenResponse<oauth2::EmptyExtraTokenFields, oauth2::basic::BasicTokenType>,
  oauth2::StandardTokenIntrospectionResponse<
    oauth2::EmptyExtraTokenFields,
    oauth2::basic::BasicTokenType,
  >,
  oauth2::StandardRevocableToken,
  oauth2::StandardErrorResponse<oauth2::RevocationErrorResponseType>,
  oauth2::EndpointSet,
  oauth2::EndpointNotSet,
  oauth2::EndpointNotSet,
  oauth2::EndpointNotSet,
  oauth2::EndpointSet,
>;

pub type HydraAccessToken = StandardTokenResponse<EmptyExtraTokenFields, BasicTokenType>;

#[derive(Clone, Debug)]
pub struct AuthorizationBroker {
  reqwest_client: Arc<reqwest::Client>,
  oauth2_client: Arc<HydraClient>,
  server_running: Arc<AtomicBool>,
}

pub struct AuthorizationBrokerResponse {
  pub access_token: String,
  pub expires_in: Option<Duration>,
  pub refresh_token: String,
}

impl From<HydraAccessToken> for AuthorizationBrokerResponse {
  fn from(token: HydraAccessToken) -> Self {
    Self {
      access_token: token.access_token().secret().to_string(),
      expires_in: token.expires_in(),
      refresh_token: token
        .refresh_token()
        .map(|t| t.secret().to_string())
        .unwrap_or_default(),
    }
  }
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AuthorizationBrokerEvent {
  pub authorize_url: String,
}

impl Default for AuthorizationBrokerEvent {
  fn default() -> Self {
    Self {
      authorize_url: format!("http://127.0.0.1:{PORT}"),
    }
  }
}

impl AuthorizationBroker {
  pub fn new(client_id: &str, uri: impl TryInto<Url>) -> Result<Self> {
    tracing::info!("Creating new authorization broker for {}", client_id);
    let uri: Url = uri
      .try_into()
      .map_err(|_| anyhow::anyhow!("Invalid oauth2 uri"))?;
    let auth_url = AuthUrl::new(uri.join("oauth2/auth").unwrap_or(uri.clone()).to_string())?;
    let token_url = TokenUrl::new(uri.join("oauth2/token").unwrap_or(uri).to_string())?;

    let reqwest_client = reqwest::ClientBuilder::new()
      // following redirects opens the client up to SSRF vulnerabilities
      .redirect(reqwest::redirect::Policy::none())
      .build()?;

    let client = BasicClient::new(ClientId::new(client_id.to_string()))
      .set_auth_uri(auth_url)
      .set_token_uri(token_url)
      .set_redirect_uri(RedirectUrl::new(format!(
        "http://127.0.0.1:{PORT}/callback"
      ))?);

    Ok(Self {
      reqwest_client: Arc::new(reqwest_client),
      oauth2_client: Arc::new(client),
      server_running: Arc::new(AtomicBool::new(false)),
    })
  }

  pub async fn exchange_refresh_token(
    &self,
    session: &AppSession,
  ) -> Result<AuthorizationBrokerResponse> {
    match session.refresh_token() {
      Some(refresh_token) => self
        .oauth2_client
        .exchange_refresh_token(&RefreshToken::new(refresh_token.to_string()))
        .request_async(self.reqwest_client.as_ref())
        .await
        .map(Into::into)
        .map_err(Into::into),
      None => Err(anyhow::anyhow!("No refresh token found")),
    }
  }

  pub async fn authorize_in_background(
    &self,
    on_ready: impl Fn(AuthorizationBrokerEvent) -> Result<()> + Send + Sync + 'static,
    send_event: impl Fn(AuthorizationBrokerResponse) -> Result<()> + Send + Sync + 'static,
  ) -> Result<()> {
    let server_running = self.server_running.clone();
    if server_running.load(Ordering::SeqCst) {
      return on_ready(AuthorizationBrokerEvent::default());
    }

    let (pkce_challenge, pkce_verifier) = PkceCodeChallenge::new_random_sha256();

    let (tx, mut rx) = mpsc::channel::<(AuthorizationCode, CsrfToken)>(1);
    let http_client = self.reqwest_client.clone();
    let oauth2_client = self.oauth2_client.clone();
    let (authorize_url, csrf_state) = oauth2_client
      .authorize_url(CsrfToken::new_random)
      .add_scope(Scope::new("openid".to_string()))
      .add_scope(Scope::new("offline".to_string()))
      .add_scope(Scope::new("profile".to_string()))
      .set_pkce_challenge(pkce_challenge)
      .url();
    let send_event = Arc::new(send_event);
    let csrf_state = csrf_state.into_secret();

    tauri::async_runtime::spawn({
      let send_event = Arc::clone(&send_event);
      async move {
        match timeout(Duration::from_secs(THREAD_TIMEOUT), rx.recv()).await {
          Ok(Some((code, state))) => {
            if state.secret() != &csrf_state {
              tracing::error!("CSRF state mismatch, rejecting request.");
              return;
            }

            match oauth2_client
              .exchange_code(code)
              .set_pkce_verifier(pkce_verifier) // Now safely moved
              .request_async(http_client.as_ref())
              .await
            {
              Ok(token) => {
                if let Err(err) = send_event(token.into()) {
                  tracing::error!("Failed to handle token: {:?}", err);
                }
              }
              Err(err) => {
                tracing::error!("Failed to exchange code: {:?}", err);
              }
            }
          }
          Ok(None) => {
            tracing::error!("Channel closed before receiving a response.");
          }
          Err(_) => {
            tracing::warn!("Authorization code exchange timed out.");
          }
        }
      }
    });

    tauri::async_runtime::spawn(async move {
      if let Err(err) = on_ready(AuthorizationBrokerEvent::default()) {
        tracing::error!("Failed to send authorize url: {:?}", err);
        return;
      }

      let result = run_local_oauth_server(authorize_url, PORT, tx).await;
      if result.is_err() {
        tracing::warn!("Authorization handler timed out after 5 minutes.");
      }

      server_running.store(false, Ordering::SeqCst);
    });

    Ok(())
  }
}
