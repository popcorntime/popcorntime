use cynic::{impl_coercions, impl_scalar};
use serde::{Deserialize, Serialize};
use std::ops::Deref;
use time::serde::format_description;

pub mod client;
pub mod consts;
pub mod media;
pub mod preferences;
pub mod providers;
pub mod reactions;
pub mod search;

impl_scalar!(Date, schema::Date);
impl_scalar!(DateTime, schema::DateTime);
impl_coercions!(Country, schema::Country);
impl_coercions!(Language, schema::Language);
format_description!(date_str, Date, "[year]-[month]-[day]");

#[derive(Debug, Clone, specta::Type, Serialize, Deserialize)]
#[serde(transparent)]
pub struct Country(String);

impl cynic::schema::IsScalar<schema::Country> for Country {
  type SchemaType = schema::Country;
}

impl schema::variable::Variable for Country {
  const TYPE: cynic::variables::VariableType =
    cynic::variables::VariableType::Named(<schema::Country as cynic::schema::NamedType>::NAME);
}

#[derive(Debug, Clone, specta::Type, Serialize, Deserialize)]
#[serde(transparent)]
pub struct Date(#[serde(with = "date_str")] time::Date);

impl Deref for Date {
  type Target = time::Date;
  fn deref(&self) -> &Self::Target {
    &self.0
  }
}

#[derive(Debug, Clone, specta::Type, Serialize, Deserialize)]
#[serde(transparent)]
pub struct DateTime(#[serde(with = "time::serde::rfc3339")] time::OffsetDateTime);

impl Deref for DateTime {
  type Target = time::OffsetDateTime;
  fn deref(&self) -> &Self::Target {
    &self.0
  }
}

#[derive(Debug, Clone, specta::Type, Serialize, Deserialize)]
#[serde(transparent)]
pub struct Language(String);

impl cynic::schema::IsScalar<schema::Language> for Language {
  type SchemaType = schema::Language;
}

impl schema::variable::Variable for Language {
  const TYPE: cynic::variables::VariableType =
    cynic::variables::VariableType::Named(<schema::Language as cynic::schema::NamedType>::NAME);
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PageInfo {
  pub end_cursor: Option<String>,
  pub has_next_page: bool,
}

#[cynic::schema("popcorntime")]
mod schema {}
