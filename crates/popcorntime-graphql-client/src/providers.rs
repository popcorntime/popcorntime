use crate::{Country, media::WatchPriceType, schema};
use serde::{Deserialize, Serialize};

#[derive(cynic::QueryVariables, Debug, specta::Type, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AddFavoriteProviderInput<'a> {
  pub country: Country,
  pub provider_key: &'a str,
}

#[derive(cynic::QueryVariables, Debug, specta::Type, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RemoveFavoriteProviderInput<'a> {
  pub country: Country,
  pub provider_key: &'a str,
}

#[derive(cynic::QueryVariables, Debug, specta::Type, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProvidersInput<'a> {
  pub country: Country,
  #[specta(optional)]
  pub favorites: Option<bool>,
  #[specta(optional)]
  pub query: Option<&'a str>,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[cynic(graphql_type = "QueryRoot", variables = "ProvidersInput")]
#[serde(rename_all = "camelCase")]
pub struct ProvidersOutput {
  #[arguments(country: $country, query: $query, favorites: $favorites)]
  pub providers: Vec<ProviderSearchForCountry>,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ProviderSearchForCountry {
  pub key: String,
  pub name: String,
  pub logo: Option<String>,
  pub weight: Option<i32>,
  pub price_types: Vec<WatchPriceType>,
  pub parent_key: Option<String>,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[cynic(
  graphql_type = "MutationRoot",
  variables = "RemoveFavoriteProviderInput"
)]
#[serde(rename_all = "camelCase")]
pub struct RemoveFavoriteProviderMutation {
  #[arguments(country: $country, providerKey: $provider_key)]
  pub remove_favorite_provider: bool,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[cynic(graphql_type = "MutationRoot", variables = "AddFavoriteProviderInput")]
#[serde(rename_all = "camelCase")]
pub struct AddFavoriteProviderMutation {
  #[arguments(country: $country, providerKey: $provider_key)]
  pub add_favorite_provider: bool,
}

#[cfg(test)]
mod tests {
  use super::*;
  use cynic::{MutationBuilder, QueryBuilder};

  #[test]
  fn preferences_query_gql_output() {
    let operation = ProvidersOutput::build(ProvidersInput {
      country: Country("US".to_string()),
      favorites: Some(true),
      query: None,
    });
    insta::assert_snapshot!(operation.query);
  }

  #[test]
  fn add_favorite_mutation_gql_output() {
    let operation = AddFavoriteProviderMutation::build(AddFavoriteProviderInput {
      country: Country("US".to_string()),
      provider_key: "netflix",
    });
    insta::assert_snapshot!(operation.query);
  }

  #[test]
  fn remove_favorite_mutation_gql_output() {
    let operation = RemoveFavoriteProviderMutation::build(RemoveFavoriteProviderInput {
      country: Country("US".to_string()),
      provider_key: "netflix",
    });
    insta::assert_snapshot!(operation.query);
  }
}
