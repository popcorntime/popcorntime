use crate::{
  Country, Date, DateTime, Language,
  media::Genre,
  media::{MediaKind, WatchPriceType},
  schema,
};
use serde::{Deserialize, Serialize};
use std::borrow::Cow;

#[derive(cynic::QueryVariables, Debug, specta::Type, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchInput<'a> {
  #[specta(optional)]
  pub after: Option<&'a str>,
  #[specta(optional)]
  pub arguments: Option<SearchArguments<'a>>,
  #[specta(optional)]
  pub before: Option<&'a str>,
  pub country: Country,
  #[specta(optional)]
  pub first: Option<i32>,
  #[specta(optional)]
  pub language: Option<Language>,
  #[specta(optional)]
  pub last: Option<i32>,
  #[specta(optional)]
  pub query: Option<&'a str>,
  pub sort_key: SortKey,
}

#[derive(cynic::InputObject, Debug, specta::Type, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchArguments<'a> {
  #[specta(optional)]
  pub collection: Option<i32>,
  #[specta(optional)]
  pub kind: Option<MediaKind>,
  #[specta(optional)]
  pub year: Option<i32>,
  #[specta(optional)]
  pub providers: Option<Vec<Cow<'a, str>>>,
  #[specta(optional)]
  pub price_types: Option<Vec<WatchPriceType>>,
  #[specta(optional)]
  pub genres: Option<Vec<Genre>>,
  #[specta(optional)]
  pub audio: Option<Language>,
  #[specta(optional)]
  pub subtitle: Option<Language>,
  #[specta(optional)]
  pub country: Option<Country>,
  #[specta(optional)]
  pub with_poster: Option<bool>,
  #[specta(optional)]
  pub featured: Option<bool>,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[cynic(graphql_type = "QueryRoot", variables = "SearchInput")]
#[serde(rename_all = "camelCase")]
pub struct SearchOutput {
  #[arguments(after: $after, before: $before, first: $first, last: $last, country: $country, language: $language, sortKey: $sort_key, query: $query, arguments: $arguments)]
  pub search: MediaSearchConnection,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MediaSearchConnection {
  pub nodes: Vec<MediaSearch>,
  pub page_info: PageInfo,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PageInfo {
  pub end_cursor: Option<String>,
  pub has_next_page: bool,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MediaSearch {
  pub id: i32,
  pub slug: String,
  pub kind: MediaKind,
  pub title: String,
  pub overview: Option<String>,
  pub poster: Option<String>,
  pub backdrop: Option<String>,
  pub providers: Vec<MeliSearchProvider>,
  pub year: Option<i32>,
  pub released: Option<Date>,
  pub updated_at: DateTime,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MeliSearchProvider {
  pub provider_id: String,
  pub price_types: Vec<WatchPriceType>,
}

#[derive(cynic::Enum, Clone, Copy, Debug, specta::Type)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum SortKey {
  Id,
  ReleasedAt,
  CreatedAt,
  UpdatedAt,
  Position,
}

#[cfg(test)]
mod tests {
  use super::*;
  use cynic::QueryBuilder;

  #[test]
  fn search_query_gql_output() {
    let operation = SearchOutput::build(SearchInput {
      after: None,
      before: None,
      arguments: Some(SearchArguments {
        collection: None,
        kind: Some(MediaKind::Movie),
        year: Some(2023),
        providers: None,
        price_types: None,
        genres: None,
        audio: None,
        subtitle: None,
        country: Some(Country("US".to_string())),
        with_poster: Some(true),
        featured: None,
      }),
      country: Country("US".to_string()),
      last: None,
      first: Some(10),
      language: Some(Language("en".to_string())),
      query: None,
      sort_key: SortKey::Position,
    });
    insta::assert_snapshot!(operation.query);
  }
}
