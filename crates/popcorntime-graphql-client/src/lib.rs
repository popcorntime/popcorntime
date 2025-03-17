use anyhow::{Context, Result};
use client::ApiClient;
use graphql_client::GraphQLQuery;
use popcorntime_error::Code;
use popcorntime_graphql_macros::define_graphql_query;

pub mod client;
pub mod consts;

type DateTime = String;
type Date = String;
type Country = String;
type Language = String;
type Tag = String;

define_graphql_query!(Search, "gql/search.graphql");
define_graphql_query!(Preferences, "gql/preferences.graphql");
define_graphql_query!(UpdatePreferences, "gql/preferences.graphql");
define_graphql_query!(Media, "gql/media.graphql");

define_graphql_query!(Providers, "gql/providers.graphql");
define_graphql_query!(AddFavoriteProvider, "gql/providers.graphql");
define_graphql_query!(RemoveFavoriteProvider, "gql/providers.graphql");
