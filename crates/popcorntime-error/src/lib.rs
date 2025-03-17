use std::{borrow::Cow, fmt::Debug};

#[derive(Debug, Default, Copy, Clone, PartialOrd, PartialEq)]
pub enum Code {
  #[default]
  Unknown,
  GraphqlServerError,
  DatabaseNotAvailable,
  InvalidSession,
  GraphqlNoData,
}

impl std::fmt::Display for Code {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let code = match self {
      Code::Unknown => "errors.unknown",
      Code::GraphqlServerError => "errors.graphql.server",
      Code::InvalidSession => "errors.session.invalid",
      Code::DatabaseNotAvailable => "errors.database.not_available",
      Code::GraphqlNoData => "errors.graphql.no_data",
    };
    f.write_str(code)
  }
}

#[derive(Default, Debug, Clone)]
pub struct Context {
  pub code: Code,
  pub message: Option<Cow<'static, str>>,
}

impl std::fmt::Display for Context {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    f.write_str(self.message.as_deref().unwrap_or("Something went wrong"))
  }
}

impl From<Code> for Context {
  fn from(code: Code) -> Self {
    Context {
      code,
      message: None,
    }
  }
}

impl Context {
  /// Create a new instance with `code` and an owned `message`.
  pub fn new(message: impl Into<String>) -> Self {
    Context {
      code: Code::Unknown,
      message: Some(Cow::Owned(message.into())),
    }
  }

  /// Create a new instance with `code` and a statically known `message`.
  pub const fn new_static(code: Code, message: &'static str) -> Self {
    Context {
      code,
      message: Some(Cow::Borrowed(message)),
    }
  }

  /// Adjust the `code` of this instance to the given one.
  pub fn with_code(mut self, code: Code) -> Self {
    self.code = code;
    self
  }
}

mod private {
  pub trait Sealed {}
}

/// A way to obtain attached Code or context information from `anyhow` contexts, so that
/// the more complete information is preferred.
pub trait AnyhowContextExt: private::Sealed {
  /// Return our custom context that might be attached to this instance.
  ///
  /// Note that it could not be named `context()` as this method already exists.
  fn custom_context(&self) -> Option<Context>;

  /// Return our custom context or default it to the root-cause of the error.
  fn custom_context_or_root_cause(&self) -> Context;
}

impl private::Sealed for anyhow::Error {}
impl AnyhowContextExt for anyhow::Error {
  fn custom_context(&self) -> Option<Context> {
    if let Some(ctx) = self.downcast_ref::<Context>() {
      Some(ctx.clone())
    } else {
      self.downcast_ref::<Code>().map(|code| (*code).into())
    }
  }

  fn custom_context_or_root_cause(&self) -> Context {
    self.custom_context().unwrap_or_else(|| Context {
      code: Code::Unknown,
      message: Some(self.root_cause().to_string().into()),
    })
  }
}
