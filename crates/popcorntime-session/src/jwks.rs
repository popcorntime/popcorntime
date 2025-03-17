use anyhow::Result;
use jsonwebtoken::jwk::{AlgorithmParameters, Jwk};
use jsonwebtoken::{Algorithm, DecodingKey, Validation};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use std::time::{Duration, Instant};
use tokio::sync::Mutex;
use uuid::Uuid;

#[derive(Debug, Deserialize, Clone)]
struct Jwks {
  keys: Vec<Jwk>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Claims {
  pub sub: Uuid,
  #[serde(rename(deserialize = "exp"))]
  pub expiration: i64,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct Consent {
  #[serde(with = "time::serde::rfc3339::option")]
  pub tos: Option<time::OffsetDateTime>,
  pub newsletter: bool,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct Preferences {
  pub country: String,
  pub language: String,
}

#[derive(Debug, Clone)]
pub struct JwksClient {
  client: reqwest::Client,
  issuer: String,
  cache: Arc<Mutex<Option<(Jwks, Instant)>>>,
  ttl: Duration,
}

impl JwksClient {
  pub fn new(issuer: &str) -> Self {
    tracing::info!("Creating JwksClient for issuer: {}", issuer);
    Self {
      client: reqwest::Client::new(),
      issuer: issuer.trim_end_matches('/').to_string(),
      cache: Arc::new(Mutex::new(None)),
      ttl: Duration::from_secs(3600), // 1 hour cache
    }
  }

  async fn refresh_jwks(&self) -> Result<Jwks> {
    let response = self
      .client
      .get(&self.issuer)
      .send()
      .await?
      .json::<Jwks>()
      .await?;

    let mut cache = self.cache.lock().await;
    *cache = Some((response.clone(), Instant::now()));

    Ok(response)
  }

  async fn get_jwks(&self) -> Result<Jwks> {
    let cache = self.cache.lock().await;
    match &*cache {
      Some((jwks, time)) if time.elapsed() < self.ttl => Ok(jwks.clone()),
      _ => {
        drop(cache); // Release lock before await
        self.refresh_jwks().await
      }
    }
  }

  async fn get_jwk(&self, kid: &str) -> Result<Jwk> {
    let jwks = self.get_jwks().await?;
    jwks
      .keys
      .into_iter()
      .find(|jwk| jwk.common.key_id.as_deref() == Some(kid))
      .ok_or(anyhow::anyhow!("JWK not found"))
  }

  pub async fn validate_token(&self, token: &str) -> Result<Uuid> {
    let header = jsonwebtoken::decode_header(token)?;
    let kid = header.kid.ok_or(anyhow::anyhow!("Missing KID"))?;

    // Get matching JWK
    let jwk = self.get_jwk(&kid).await?;

    // Create decoding key
    let decoding_key = match jwk.algorithm {
      AlgorithmParameters::RSA(rsa) => DecodingKey::from_rsa_components(&rsa.n, &rsa.e)?,
      _ => anyhow::bail!("Unsupported algorithm"),
    };

    // Configure validation
    let mut validation = Validation::new(Algorithm::RS256);
    validation.leeway = 60;

    // FIXME: would worth attaching the audience to kratos
    // and the internal service API token
    validation.validate_aud = false;
    // FIXME: resign internal API service token with the issuer
    //validation.set_issuer(&[self.issuer.clone()]);

    // Validate token
    tracing::info!("Validating token with KID: {}", kid);
    jsonwebtoken::decode::<Claims>(token, &decoding_key, &validation)
      .map(|claim| claim.claims.sub)
      .map_err(Into::into)
  }
}
