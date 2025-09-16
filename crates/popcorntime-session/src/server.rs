use oauth2::{AuthorizationCode, CsrfToken};
use poem::{
  EndpointExt, Route, Server, get, handler,
  listener::TcpListener,
  web::{Data, Query, Redirect},
};
use serde::Deserialize;
use std::{net::SocketAddr, sync::Arc};
use tokio::sync::mpsc;
use tokio_util::sync::CancellationToken;
use url::Url;

const SUCCESS_URL: &str = "https://watch.popcorntime.app/auth/success";

#[derive(Deserialize)]
struct CallbackQuery {
  code: String,
  state: String,
}

#[derive(Clone)]
struct RedirectUrl(String);
impl RedirectUrl {
  fn inner(&self) -> &str {
    &self.0
  }
}

#[handler]
async fn redirect_handler(Data(auth_url): Data<&RedirectUrl>) -> Redirect {
  Redirect::temporary(auth_url.inner())
}

#[handler]
async fn callback_handler(
  Query(q): Query<CallbackQuery>,
  Data(code_tx): Data<&Arc<mpsc::Sender<(AuthorizationCode, CsrfToken)>>>,
  Data(shutdown_tx): Data<&Arc<CancellationToken>>,
) -> Redirect {
  if let Err(err) = code_tx
    .send((AuthorizationCode::new(q.code), CsrfToken::new(q.state)))
    .await
  {
    // FIXME: show error to user?
    tracing::error!("Failed to send authorization code: {}", err);
  }

  shutdown_tx.cancel();

  Redirect::temporary(SUCCESS_URL)
}

pub async fn run_local_oauth_server(
  authorize_url: Url,
  port: u16,
  code_tx: mpsc::Sender<(AuthorizationCode, CsrfToken)>,
) -> anyhow::Result<()> {
  let shutdown_tx = CancellationToken::new();
  let auth_url = RedirectUrl(authorize_url.to_string());

  let app = Route::new()
    .at("/", get(redirect_handler))
    .at("/callback", get(callback_handler))
    .data(auth_url)
    .data(Arc::new(code_tx))
    .data(Arc::new(shutdown_tx.clone()));

  let addr = SocketAddr::from(([127, 0, 0, 1], port));
  let listener = TcpListener::bind(addr);

  tokio::spawn(async move {
    Server::new(listener)
      .run_with_graceful_shutdown(app, shutdown_tx.cancelled(), None)
      .await
  });

  Ok(())
}
