use oauth2::{AuthorizationCode, CsrfToken};
use poem::{
  Endpoint, EndpointExt, IntoResponse, Response, Route, Server, get, handler,
  http::StatusCode,
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

#[derive(Clone)]
struct ExpectedState(String);

#[handler]
async fn callback_handler(
  Query(q): Query<CallbackQuery>,
  Data(expected_state): Data<&ExpectedState>,
  Data(code_tx): Data<&Arc<mpsc::Sender<(AuthorizationCode, CsrfToken)>>>,
  Data(shutdown_tx): Data<&Arc<CancellationToken>>,
) -> Response {
  // Only accept a callback that carries the state we issued for this login
  // attempt. Anything else (a stray local request, a web page poking at
  // localhost) is rejected without consuming the one-shot channel or shutting
  // the server down, so it cannot make the genuine login fail.
  if q.state != expected_state.0 {
    tracing::warn!("OAuth callback with unexpected state ignored.");
    return StatusCode::BAD_REQUEST.into_response();
  }

  if let Err(err) = code_tx
    .send((AuthorizationCode::new(q.code), CsrfToken::new(q.state)))
    .await
  {
    // FIXME: show error to user?
    tracing::error!("Failed to send authorization code: {}", err);
  }

  shutdown_tx.cancel();

  Redirect::temporary(SUCCESS_URL).into_response()
}

fn build_app(
  authorize_url: &Url,
  expected_state: String,
  code_tx: mpsc::Sender<(AuthorizationCode, CsrfToken)>,
  shutdown_tx: CancellationToken,
) -> impl Endpoint<Output = Response> + use<> {
  Route::new()
    .at("/", get(redirect_handler))
    .at("/callback", get(callback_handler))
    .data(RedirectUrl(authorize_url.to_string()))
    .data(ExpectedState(expected_state))
    .data(Arc::new(code_tx))
    .data(Arc::new(shutdown_tx))
}

pub async fn run_local_oauth_server(
  authorize_url: Url,
  port: u16,
  expected_state: String,
  code_tx: mpsc::Sender<(AuthorizationCode, CsrfToken)>,
) -> anyhow::Result<()> {
  let shutdown_tx = CancellationToken::new();

  let app = build_app(&authorize_url, expected_state, code_tx, shutdown_tx.clone());

  let addr = SocketAddr::from(([127, 0, 0, 1], port));
  let listener = TcpListener::bind(addr);

  tokio::spawn(async move {
    Server::new(listener)
      .run_with_graceful_shutdown(app, shutdown_tx.cancelled(), None)
      .await
  });

  Ok(())
}

#[cfg(test)]
mod tests {
  use super::*;
  use poem::{Request, http::Uri};

  fn test_app(
    expected_state: &str,
  ) -> (
    impl Endpoint<Output = Response>,
    mpsc::Receiver<(AuthorizationCode, CsrfToken)>,
    CancellationToken,
  ) {
    let (tx, rx) = mpsc::channel(1);
    let shutdown = CancellationToken::new();
    let url = Url::parse("https://auth.example/oauth2/auth").unwrap();
    let app = build_app(&url, expected_state.to_string(), tx, shutdown.clone());
    (app, rx, shutdown)
  }

  fn get_request(path_and_query: &str) -> Request {
    Request::builder()
      .uri(path_and_query.parse::<Uri>().unwrap())
      .finish()
  }

  #[tokio::test]
  async fn callback_with_wrong_state_is_rejected_and_does_not_end_the_login() {
    let (app, mut rx, shutdown) = test_app("expected-state");

    let resp = app
      .call(get_request("/callback?code=abc&state=wrong-state"))
      .await
      .unwrap();

    assert_eq!(resp.status(), StatusCode::BAD_REQUEST);
    assert!(rx.try_recv().is_err(), "code must not be forwarded");
    assert!(!shutdown.is_cancelled(), "server must keep running");
  }

  #[tokio::test]
  async fn callback_with_expected_state_forwards_code_and_shuts_down() {
    let (app, mut rx, shutdown) = test_app("expected-state");

    let resp = app
      .call(get_request("/callback?code=abc&state=expected-state"))
      .await
      .unwrap();

    assert_eq!(resp.status(), StatusCode::TEMPORARY_REDIRECT);
    let (code, state) = rx.try_recv().expect("code should be forwarded");
    assert_eq!(code.secret(), "abc");
    assert_eq!(state.secret(), "expected-state");
    assert!(shutdown.is_cancelled());
  }

  #[tokio::test]
  async fn wrong_state_then_correct_state_still_completes_login() {
    let (app, mut rx, shutdown) = test_app("expected-state");

    let bad = app
      .call(get_request("/callback?code=evil&state=nope"))
      .await
      .unwrap();
    assert_eq!(bad.status(), StatusCode::BAD_REQUEST);

    let good = app
      .call(get_request("/callback?code=real&state=expected-state"))
      .await
      .unwrap();
    assert_eq!(good.status(), StatusCode::TEMPORARY_REDIRECT);

    let (code, _) = rx.try_recv().expect("real code should be forwarded");
    assert_eq!(code.secret(), "real");
    assert!(shutdown.is_cancelled());
  }
}
