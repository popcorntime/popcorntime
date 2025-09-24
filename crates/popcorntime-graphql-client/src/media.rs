use crate::{Country, Date, Language, schema};
use serde::{Deserialize, Serialize};

#[derive(cynic::QueryVariables, Debug, specta::Type, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MediaInput<'a> {
  pub country: Country,
  pub slug: &'a str,
  #[specta(optional)]
  pub language: Option<Language>,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[cynic(graphql_type = "QueryRoot", variables = "MediaInput")]
#[serde(rename_all = "camelCase")]
pub struct MediaOutput {
  #[arguments(by: { slug: $slug }, country: $country, language: $language)]
  pub media: Option<Media>,
}

#[derive(cynic::InlineFragments, Debug, specta::Type, Serialize)]
#[cynic(variables = "MediaInput")]
#[serde(tag = "kind")]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Media {
  Movie(Movie),
  Tvshow(Tvshow),
  #[cynic(fallback)]
  #[serde(skip)]
  Unknown,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[cynic(graphql_type = "TVShow", variables = "MediaInput")]
#[serde(rename_all = "camelCase")]
pub struct Tvshow {
  pub in_production: bool,
  pub id: i32,
  #[serde(rename = "__typename")]
  pub __typename: String,
  pub title: String,
  pub slug: String,
  pub overview: Option<String>,
  pub tagline: Option<String>,
  pub languages: Vec<Language>,
  pub poster: Option<String>,
  pub backdrop: Option<String>,
  pub released: Option<String>,
  pub year: Option<i32>,
  pub country: Option<Country>,
  pub tags: Vec<Tag>,
  pub trailers: Vec<String>,
  pub genres: Vec<Genre>,
  pub classification: Option<String>,
  pub countries: Vec<Country>,
  pub kind: MediaKind,
  pub videos: Vec<MediaVideo>,
  pub ratings: Vec<ExternalRating>,
  pub ranking: Option<Ranking>,
  #[arguments(language: $language)]
  pub pochoclin_review: Option<PochoclinReview>,
  #[arguments(country: $country, language: $language)]
  #[cynic(rename = "similars")]
  pub similars: Vec<MediaSimilar>,
  #[arguments(country: $country, language: $language, arguments: { priceTypes: "FREE" })]
  #[cynic(rename = "similars")]
  pub similars_free: Vec<MediaSimilar>,
  #[arguments(country: $country, language: $language)]
  pub charts: Vec<MediaCharts>,
  #[arguments(country: $country)]
  pub availabilities: Vec<Availability>,
  pub talents: Vec<People>,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[cynic(graphql_type = "Movie", variables = "MediaInput")]
#[serde(rename_all = "camelCase")]
pub struct Movie {
  pub runtime: String,
  pub id: i32,
  #[serde(rename = "__typename")]
  pub __typename: String,
  pub title: String,
  pub slug: String,
  pub overview: Option<String>,
  pub tagline: Option<String>,
  pub languages: Vec<Language>,
  pub poster: Option<String>,
  pub backdrop: Option<String>,
  pub released: Option<String>,
  pub year: Option<i32>,
  pub country: Option<Country>,
  pub tags: Vec<Tag>,
  pub trailers: Vec<String>,
  pub genres: Vec<Genre>,
  pub classification: Option<String>,
  pub countries: Vec<Country>,
  pub kind: MediaKind,
  pub videos: Vec<MediaVideo>,
  pub ratings: Vec<ExternalRating>,
  pub ranking: Option<Ranking>,
  #[arguments(language: $language)]
  pub pochoclin_review: Option<PochoclinReview>,
  #[arguments(country: $country, language: $language, arguments: {})]
  #[cynic(rename = "similars")]
  pub similars: Vec<MediaSimilar>,
  #[arguments(country: $country, language: $language, arguments: { priceTypes: "FREE" })]
  #[cynic(rename = "similars")]
  pub similars_free: Vec<MediaSimilar>,
  #[arguments(country: $country, language: $language)]
  pub charts: Vec<MediaCharts>,
  #[arguments(country: $country)]
  pub availabilities: Vec<Availability>,
  pub talents: Vec<People>,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct People {
  pub id: i32,
  pub rank: i32,
  pub name: String,
  pub role: Option<String>,
  pub role_type: RoleType,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PochoclinReview {
  pub review: String,
  pub excerpt: String,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Ranking {
  pub score: i32,
  pub position: i32,
  pub points: i32,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
pub struct MediaVideo {
  pub source: VideoSource,
  pub video_id: String,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[cynic(graphql_type = "MediaSearch")]
#[serde(rename_all = "camelCase")]
pub struct MediaSimilar {
  pub title: String,
  pub overview: Option<String>,
  pub kind: MediaKind,
  pub slug: String,
  pub poster: Option<String>,
  pub year: Option<i32>,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[cynic(graphql_type = "MediaSearch")]
#[serde(rename_all = "camelCase")]
pub struct MediaCharts {
  pub title: String,
  pub kind: MediaKind,
  pub slug: String,
  pub poster: Option<String>,
  pub year: Option<i32>,
  pub rank: Option<MediaCountryRanking>,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MediaCountryRanking {
  pub position: i32,
  pub change: f64,
  pub points: i32,
  pub previous_points: i32,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ExternalRating {
  pub rating: f64,
  pub source: RatingSource,
}

#[derive(cynic::QueryFragment, Debug, specta::Type, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Availability {
  pub provider_id: String,
  pub provider_name: String,
  pub logo: Option<String>,
  pub available_to: Option<Date>,
  pub url_hash: String,
  pub audio_languages: Option<Vec<Language>>,
  pub subtitle_languages: Option<Vec<Language>>,
  pub prices_type: Option<Vec<WatchPriceType>>,
}

#[derive(cynic::Enum, Clone, Copy, Debug, specta::Type)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Genre {
  Action,
  Adventure,
  Animation,
  Comedy,
  Crime,
  Documentary,
  Drama,
  Family,
  Fantasy,
  History,
  Horror,
  Music,
  Mystery,
  Romance,
  ScienceFiction,
  TvMovie,
  Thriller,
  War,
  Western,
  Other,
}

#[derive(cynic::Enum, Clone, Copy, Debug, specta::Type)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum MediaKind {
  Movie,
  TvShow,
}

#[derive(cynic::Enum, Clone, Copy, Debug, specta::Type)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum RatingSource {
  Imdb,
  Tmdb,
}

#[derive(cynic::Enum, Clone, Copy, Debug, specta::Type)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum RoleType {
  ExecutiveProducer,
  Director,
  FirstAssistantDirector,
  SecondAssistantDirector,
  SecondSecondAssistantDirector,
  ScriptSupervisor,
  Producer,
  Writer,
  Actor,
}

#[derive(cynic::Enum, Clone, Copy, Debug, specta::Type)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum VideoSource {
  Rumble,
  Youtube,
}

#[derive(cynic::Enum, Clone, Copy, Debug, specta::Type)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum WatchPriceType {
  Rent,
  Buy,
  Flatrate,
  Free,
  Cinema,
}

#[derive(cynic::Scalar, Debug, Clone, specta::Type)]
#[serde(transparent)]
pub struct Tag(pub String);

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn media_query_gql_output() {
    use cynic::QueryBuilder;

    let operation = MediaOutput::build(MediaInput {
      country: Country("US".to_string()),
      language: Some(Language("en".to_string())),
      slug: "the-dark-knight",
    });

    insta::assert_snapshot!(operation.query);
  }
}
