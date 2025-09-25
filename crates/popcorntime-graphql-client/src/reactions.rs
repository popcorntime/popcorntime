use crate::{PageInfo, schema};
use serde::{Deserialize, Serialize};

#[derive(cynic::Enum, Clone, Copy, Debug, specta::Type)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
#[cynic(graphql_type = "UserReactionType")]
pub enum UserReactionType {
  Like,
  Dislike,
}

#[derive(cynic::QueryVariables, Debug, specta::Type, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SetReactionInput {
  pub media_id: i32,
  pub reaction: Option<UserReactionType>,
}

#[derive(cynic::QueryVariables, Debug, specta::Type, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UserReactionsInput<'a> {
  #[specta(optional)]
  pub after: Option<&'a str>,
  #[specta(optional)]
  pub before: Option<&'a str>,
  #[specta(optional)]
  pub first: Option<i32>,
  #[specta(optional)]
  pub last: Option<i32>,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[cynic(graphql_type = "QueryRoot", variables = "UserReactionsInput")]
#[serde(rename_all = "camelCase")]
pub struct UserReactions {
  #[arguments(after: $after, before: $before, first: $first, last: $last)]
  pub reactions: UserReactionConnection,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct UserReactionConnection {
  pub nodes: Vec<UserReaction>,
  pub page_info: PageInfo,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct UserReaction {
  pub media_id: i32,
  pub reaction: UserReactionType,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[cynic(graphql_type = "MutationRoot", variables = "SetReactionInput")]
#[serde(rename_all = "camelCase")]
pub struct SetReactionMutation {
  #[arguments(mediaId: $media_id, reaction: $reaction)]
  pub set_reaction: bool,
}

#[cfg(test)]
mod tests {
  use super::*;
  use cynic::{MutationBuilder, QueryBuilder};

  #[test]
  fn reactions_query_gql_output() {
    let operation = UserReactions::build(UserReactionsInput {
      first: Some(10),
      after: None,
      before: None,
      last: None,
    });

    insta::assert_snapshot!(operation.query);
  }

  #[test]
  fn set_reaction_like_mutation_gql_output() {
    let operation = SetReactionMutation::build(SetReactionInput {
      media_id: 123,
      reaction: Some(UserReactionType::Like),
    });
    insta::assert_snapshot!(operation.query);
  }

  #[test]
  fn remove_favorite_mutation_gql_output() {
    let operation = SetReactionMutation::build(SetReactionInput {
      media_id: 123,
      reaction: Some(UserReactionType::Dislike),
    });
    insta::assert_snapshot!(operation.query);
  }

  #[test]
  fn delete_favorite_mutation_gql_output() {
    let operation = SetReactionMutation::build(SetReactionInput {
      media_id: 123,
      reaction: None,
    });
    insta::assert_snapshot!(operation.query);
  }
}
