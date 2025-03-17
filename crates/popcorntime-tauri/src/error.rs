use popcorntime_error::AnyhowContextExt;
use serde::{ser::SerializeMap, Serialize};
use std::borrow::Cow;

/// An error type for serialization which isn't expected to carry a code.
#[derive(Debug)]
pub struct UnmarkedError(anyhow::Error);

impl<T> From<T> for UnmarkedError
where
  T: std::error::Error + Send + Sync + 'static,
{
  fn from(err: T) -> Self {
    Self(err.into())
  }
}

impl Serialize for UnmarkedError {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: serde::Serializer,
  {
    let ctx = self.0.custom_context_or_root_cause();

    let mut map = serializer.serialize_map(Some(2))?;
    map.serialize_entry("code", &ctx.code.to_string())?;
    let message = ctx.message.unwrap_or_else(|| {
      self
        .0
        .source()
        .map(|err| Cow::Owned(err.to_string()))
        .unwrap_or_else(|| Cow::Borrowed("Something went wrong"))
    });
    map.serialize_entry("message", &message)?;
    map.end()
  }
}

/// An error type for serialization, dynamically extracting context information during serialization,
/// meant for consumption by the frontend.
#[derive(Debug)]
pub struct Error(anyhow::Error);

impl From<anyhow::Error> for Error {
  fn from(value: anyhow::Error) -> Self {
    Self(value)
  }
}

impl Serialize for Error {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: serde::Serializer,
  {
    let ctx = self.0.custom_context_or_root_cause();

    let mut map = serializer.serialize_map(Some(2))?;
    map.serialize_entry("code", &ctx.code.to_string())?;
    let message = ctx.message.unwrap_or_else(|| {
      self
        .0
        .source()
        .map(|err| Cow::Owned(err.to_string()))
        .unwrap_or_else(|| Cow::Borrowed("An unknown backend error occurred"))
    });
    map.serialize_entry("message", &message)?;
    map.end()
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use anyhow::anyhow;
  use popcorntime_error::{Code, Context};

  fn json(err: anyhow::Error) -> String {
    serde_json::to_string(&Error(err)).unwrap()
  }

  #[test]
  fn no_context_or_code_shows_root_error() {
    let err = anyhow!("err msg");
    assert_eq!(
      format!("{:#}", err),
      "err msg",
      "just one error on display here"
    );
    assert_eq!(
      json(err),
      "{\"code\":\"errors.unknown\",\"message\":\"err msg\"}",
      "if there is no explicit error code or context, the original error message is shown"
    );
  }

  #[test]
  fn find_code() {
    let err = anyhow!("err msg").context(Code::InvalidSession);
    assert_eq!(
      format!("{:#}", err),
      "errors.session.invalid: err msg",
      "note how the context becomes an error, in front of the original one"
    );
    assert_eq!(
      json(err),
      "{\"code\":\"errors.session.invalid\",\"message\":\"err msg\"}",
      "the 'code' is available as string, but the message is taken from the source error"
    );
  }

  #[test]
  fn find_code_after_cause() {
    let original_err = std::io::Error::other("actual cause");
    let err = anyhow::Error::from(original_err)
      .context("err msg")
      .context(Code::InvalidSession);

    assert_eq!(
      format!("{:#}", err),
      "errors.session.invalid: err msg: actual cause",
      "an even longer chain, with the cause as root as one might expect"
    );
    assert_eq!(
                json(err),
                "{\"code\":\"errors.session.invalid\",\"message\":\"err msg\"}",
                "in order to attach a custom message to an original cause, our messaging (and Code) is the tail"
            );
  }

  #[test]
  fn find_context() {
    let err = anyhow!("err msg").context(Context::new_static(Code::InvalidSession, "ctx msg"));
    assert_eq!(format!("{:#}", err), "ctx msg: err msg");
    assert_eq!(
      json(err),
      "{\"code\":\"errors.session.invalid\",\"message\":\"ctx msg\"}",
      "Contexts often provide their own message, so the error message is ignored"
    );
  }

  #[test]
  fn find_context_without_message() {
    let err = anyhow!("err msg").context(Context::from(Code::InvalidSession));
    assert_eq!(
      format!("{:#}", err),
      "Something went wrong: err msg",
      "on display, `Context` does just insert a generic message"
    );
    assert_eq!(
      json(err),
      "{\"code\":\"errors.session.invalid\",\"message\":\"err msg\"}",
      "Contexts without a message show the error's message as well"
    );
  }

  #[test]
  fn find_nested_code() {
    let err = anyhow!("bottom msg")
      .context("top msg")
      .context(Code::InvalidSession);
    assert_eq!(
      format!("{:#}", err),
      "errors.session.invalid: top msg: bottom msg",
      "now it's clear why bottom is bottom"
    );
    assert_eq!(
                json(err),
                "{\"code\":\"errors.session.invalid\",\"message\":\"top msg\"}",
                "the 'code' gets the message of the error that it provides context to, and it finds it down the chain"
            );
  }
}
