use crate::{Country, media::WatchPriceType, schema};
use serde::{Deserialize, Serialize};

#[derive(cynic::QueryVariables, Debug, specta::Type, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SetFavoriteProviderInput<'a> {
  pub country: Country,
  pub provider_key: &'a str,
  pub favorite: bool,
}

#[derive(cynic::QueryVariables, Debug, specta::Type, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProvidersInput<'a> {
  pub country: Country,
  #[specta(optional)]
  pub query: Option<&'a str>,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[cynic(graphql_type = "QueryRoot", variables = "ProvidersInput")]
#[serde(rename_all = "camelCase")]
pub struct ProvidersOutput {
  #[arguments(country: $country, query: $query)]
  pub providers: Vec<Provider>,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Provider {
  pub key: String,
  pub favorite: bool,
  pub name: String,
  pub logo: Option<String>,
  pub weight: Option<i32>,
  pub price_types: Vec<WatchPriceType>,
  pub parent_key: Option<String>,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[cynic(graphql_type = "MutationRoot", variables = "SetFavoriteProviderInput")]
#[serde(rename_all = "camelCase")]
pub struct SetFavoriteProviderMutation {
  #[arguments(country: $country, providerKey: $provider_key, favorite: $favorite)]
  pub set_favorite_provider: bool,
}

#[cfg(test)]
mod tests {
  use super::*;
  use cynic::{MutationBuilder, QueryBuilder};

  #[test]
  fn preferences_query_gql_output() {
    let operation = ProvidersOutput::build(ProvidersInput {
      country: Country("US".to_string()),
      query: None,
    });
    insta::assert_snapshot!(operation.query);
  }

  #[test]
  fn add_favorite_mutation_gql_output() {
    let operation = SetFavoriteProviderMutation::build(SetFavoriteProviderInput {
      country: Country("US".to_string()),
      provider_key: "netflix",
      favorite: true,
    });
    insta::assert_snapshot!(operation.query);
  }

  #[test]
  fn remove_favorite_mutation_gql_output() {
    let operation = SetFavoriteProviderMutation::build(SetFavoriteProviderInput {
      country: Country("US".to_string()),
      provider_key: "netflix",
      favorite: false,
    });
    insta::assert_snapshot!(operation.query);
  }
}
