use crate::{Country, Language, schema};
use serde::{Deserialize, Serialize};

#[derive(cynic::QueryVariables, Debug, specta::Type, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdatePreferencesInput {
  pub country: Country,
  pub language: Language,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[cynic(graphql_type = "QueryRoot")]
#[serde(rename_all = "camelCase")]
pub struct PreferencesOutput {
  pub preferences: Option<UserPreferences>,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct UserPreferences {
  pub language: Language,
  pub country: Country,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[cynic(graphql_type = "MutationRoot", variables = "UpdatePreferencesInput")]
#[serde(rename_all = "camelCase")]
pub struct UpdatePreferencesMutation {
  #[arguments(country: $country, language: $language)]
  pub update_preferences: Option<UserPreferences>,
}

#[cfg(test)]
mod tests {
  use super::*;
  use cynic::{MutationBuilder, QueryBuilder};

  #[test]
  fn preferences_query_gql_output() {
    let operation = PreferencesOutput::build(());
    insta::assert_snapshot!(operation.query);
  }

  #[test]
  fn preferences_mutation_gql_output() {
    let operation = UpdatePreferencesMutation::build(UpdatePreferencesInput {
      country: Country("US".to_string()),
      language: Language("en".to_string()),
    });
    insta::assert_snapshot!(operation.query);
  }
}
