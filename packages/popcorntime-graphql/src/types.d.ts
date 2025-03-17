export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Country: { input: import('@popcorntime/i18n').Country; output: import('@popcorntime/i18n').Country; }
  Date: { input: Date; output: Date; }
  DateTime: { input: Date; output: Date; }
  Language: { input: import('@popcorntime/i18n').Locale; output: import('@popcorntime/i18n').Locale; }
  Tag: { input: string; output: string; }
  UUID: { input: string; output: string; }
};

export type Availability = {
  __typename?: 'Availability';
  audioLanguages?: Maybe<Array<Scalars['Language']['output']>>;
  availableTo?: Maybe<Scalars['Date']['output']>;
  formats?: Maybe<Array<MediaFormat>>;
  logo?: Maybe<Scalars['String']['output']>;
  pricesType?: Maybe<Array<WatchPriceType>>;
  providerId: Scalars['String']['output'];
  providerName: Scalars['String']['output'];
  subtitleLanguages?: Maybe<Array<Scalars['Language']['output']>>;
  urlHash: Scalars['String']['output'];
};

export type CollectionSearch = {
  __typename?: 'CollectionSearch';
  country: Scalars['Country']['output'];
  id: Scalars['Int']['output'];
  language?: Maybe<Scalars['Language']['output']>;
  slug: Scalars['String']['output'];
};

export type ExternalId = {
  __typename?: 'ExternalId';
  id: Scalars['String']['output'];
  source: MetaSource;
};

export type ExternalRating = {
  __typename?: 'ExternalRating';
  rating: Scalars['Float']['output'];
  source: RatingSource;
};

export enum Genre {
  ACTION = 'ACTION',
  ADVENTURE = 'ADVENTURE',
  ANIMATION = 'ANIMATION',
  COMEDY = 'COMEDY',
  CRIME = 'CRIME',
  DOCUMENTARY = 'DOCUMENTARY',
  DRAMA = 'DRAMA',
  FAMILY = 'FAMILY',
  FANTASY = 'FANTASY',
  HISTORY = 'HISTORY',
  HORROR = 'HORROR',
  MUSIC = 'MUSIC',
  MYSTERY = 'MYSTERY',
  OTHER = 'OTHER',
  ROMANCE = 'ROMANCE',
  SCIENCE_FICTION = 'SCIENCE_FICTION',
  THRILLER = 'THRILLER',
  TV_MOVIE = 'TV_MOVIE',
  WAR = 'WAR',
  WESTERN = 'WESTERN'
}

export type HomeSearchForCountry = {
  __typename?: 'HomeSearchForCountry';
  /** Short ID */
  id: Scalars['Country']['output'];
  newMovies: Array<MediaSearch>;
  newTvshows: Array<MediaSearch>;
  topMovies: Array<MediaSearch>;
  topSeries: Array<MediaSearch>;
};

export type Media = {
  availabilities: Array<Availability>;
  backdrop?: Maybe<Scalars['String']['output']>;
  charts: Array<MediaSearch>;
  classification?: Maybe<Scalars['String']['output']>;
  countries: Array<Scalars['Country']['output']>;
  country?: Maybe<Scalars['Country']['output']>;
  createdAt: Scalars['String']['output'];
  genres: Array<Genre>;
  homepage?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  ids: Array<ExternalId>;
  kind: MediaKind;
  languages: Array<Scalars['Language']['output']>;
  overview?: Maybe<Scalars['String']['output']>;
  pochoclinReview?: Maybe<PochoclinReview>;
  poster?: Maybe<Scalars['String']['output']>;
  ranking?: Maybe<Ranking>;
  ratings: Array<ExternalRating>;
  released?: Maybe<Scalars['String']['output']>;
  similars: Array<MediaSearch>;
  slug: Scalars['String']['output'];
  tagline?: Maybe<Scalars['String']['output']>;
  tags: Array<Scalars['Tag']['output']>;
  talents: Array<People>;
  title: Scalars['String']['output'];
  trailers: Array<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
  videos: Array<MediaVideo>;
  year?: Maybe<Scalars['Int']['output']>;
};


export type MediaavailabilitiesArgs = {
  country: Scalars['Country']['input'];
  format?: InputMaybe<MediaFormat>;
  priceType?: InputMaybe<WatchPriceType>;
};


export type MediachartsArgs = {
  country: Scalars['Country']['input'];
  language?: InputMaybe<Scalars['Language']['input']>;
};


export type MediapochoclinReviewArgs = {
  language?: InputMaybe<Scalars['Language']['input']>;
};


export type MediasimilarsArgs = {
  arguments?: InputMaybe<SearchArguments>;
  country: Scalars['Country']['input'];
  language?: InputMaybe<Scalars['Language']['input']>;
};

export type MediaBy = {
  id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type MediaCountryRanking = {
  __typename?: 'MediaCountryRanking';
  change: Scalars['Float']['output'];
  points: Scalars['Int']['output'];
  position: Scalars['Int']['output'];
  previousPoints: Scalars['Int']['output'];
  previousPosition: Scalars['Int']['output'];
  score: Scalars['Int']['output'];
};

export enum MediaFormat {
  HD = 'HD',
  SD = 'SD',
  UHD = 'UHD',
  UNKNOWN = 'UNKNOWN',
  _3D = '_3D',
  _4K = '_4K'
}

export enum MediaKind {
  MOVIE = 'MOVIE',
  TV_SHOW = 'TV_SHOW'
}

export type MediaSearch = {
  __typename?: 'MediaSearch';
  backdrop?: Maybe<Scalars['String']['output']>;
  classification?: Maybe<Scalars['String']['output']>;
  collections: Array<Scalars['Int']['output']>;
  country?: Maybe<Scalars['Country']['output']>;
  featuredFrom?: Maybe<Scalars['Date']['output']>;
  genres: Array<Genre>;
  id: Scalars['Int']['output'];
  kind: MediaKind;
  offersLanguages: Array<Scalars['Language']['output']>;
  offersSubtitles: Array<Scalars['Language']['output']>;
  originalTitle?: Maybe<Scalars['String']['output']>;
  overview?: Maybe<Scalars['String']['output']>;
  poster?: Maybe<Scalars['String']['output']>;
  providers: Array<MeliSearchProvider>;
  rank?: Maybe<MediaCountryRanking>;
  released?: Maybe<Scalars['Date']['output']>;
  slug: Scalars['String']['output'];
  tagline?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  year?: Maybe<Scalars['Int']['output']>;
};

export type MediaSearchConnection = {
  __typename?: 'MediaSearchConnection';
  /** A list of edges. */
  edges: Array<MediaSearchEdge>;
  /** A list of nodes. */
  nodes: Array<MediaSearch>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type MediaSearchEdge = {
  __typename?: 'MediaSearchEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: MediaSearch;
};

export type MediaVideo = {
  __typename?: 'MediaVideo';
  id: Scalars['Int']['output'];
  source: VideoSource;
  videoId: Scalars['String']['output'];
};

export type MeliSearchProvider = {
  __typename?: 'MeliSearchProvider';
  priceTypes: Array<WatchPriceType>;
  providerId: Scalars['String']['output'];
};

export enum MetaSource {
  IMDB = 'IMDB',
  TMDB = 'TMDB',
  TRAKT = 'TRAKT',
  TVDB = 'TVDB'
}

export type Movie = Media & {
  __typename?: 'Movie';
  availabilities: Array<Availability>;
  backdrop?: Maybe<Scalars['String']['output']>;
  charts: Array<MediaSearch>;
  classification?: Maybe<Scalars['String']['output']>;
  countries: Array<Scalars['Country']['output']>;
  country?: Maybe<Scalars['Country']['output']>;
  createdAt: Scalars['String']['output'];
  genres: Array<Genre>;
  homepage?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  ids: Array<ExternalId>;
  kind: MediaKind;
  languages: Array<Scalars['Language']['output']>;
  overview?: Maybe<Scalars['String']['output']>;
  pochoclinReview?: Maybe<PochoclinReview>;
  poster?: Maybe<Scalars['String']['output']>;
  ranking?: Maybe<Ranking>;
  ratings: Array<ExternalRating>;
  released?: Maybe<Scalars['String']['output']>;
  runtime: Scalars['String']['output'];
  similars: Array<MediaSearch>;
  slug: Scalars['String']['output'];
  tagline?: Maybe<Scalars['String']['output']>;
  tags: Array<Scalars['Tag']['output']>;
  talents: Array<People>;
  title: Scalars['String']['output'];
  trailers: Array<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
  videos: Array<MediaVideo>;
  year?: Maybe<Scalars['Int']['output']>;
};


export type MovieavailabilitiesArgs = {
  country: Scalars['Country']['input'];
  format?: InputMaybe<MediaFormat>;
  priceType?: InputMaybe<WatchPriceType>;
};


export type MoviechartsArgs = {
  country: Scalars['Country']['input'];
  language?: InputMaybe<Scalars['Language']['input']>;
};


export type MoviepochoclinReviewArgs = {
  language?: InputMaybe<Scalars['Language']['input']>;
};


export type MoviesimilarsArgs = {
  arguments?: InputMaybe<SearchArguments>;
  country: Scalars['Country']['input'];
  language?: InputMaybe<Scalars['Language']['input']>;
};

export type MutationRoot = {
  __typename?: 'MutationRoot';
  addFavoriteProvider: Scalars['Boolean']['output'];
  removeFavoriteProvider: Scalars['Boolean']['output'];
  updatePreferences?: Maybe<UserPreferences>;
};


export type MutationRootaddFavoriteProviderArgs = {
  country: Scalars['Country']['input'];
  providerKey: Scalars['String']['input'];
};


export type MutationRootremoveFavoriteProviderArgs = {
  country: Scalars['Country']['input'];
  providerKey: Scalars['String']['input'];
};


export type MutationRootupdatePreferencesArgs = {
  country: Scalars['Country']['input'];
  language: Scalars['Language']['input'];
};

/** Information about pagination in a connection */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type People = {
  __typename?: 'People';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  rank: Scalars['Int']['output'];
  role?: Maybe<Scalars['String']['output']>;
  roleType: RoleType;
};

export type PochoclinReview = {
  __typename?: 'PochoclinReview';
  excerpt: Scalars['String']['output'];
  language: Scalars['Language']['output'];
  review: Scalars['String']['output'];
};

export type ProviderSearchForCountry = {
  __typename?: 'ProviderSearchForCountry';
  /** Short ID */
  id: Scalars['String']['output'];
  /** ID of the provider */
  key: Scalars['String']['output'];
  /** Logo of the provider */
  logo?: Maybe<Scalars['String']['output']>;
  /** Name of the provider */
  name: Scalars['String']['output'];
  /** Parent ID */
  parentKey?: Maybe<Scalars['String']['output']>;
  /** Available price types */
  priceTypes: Array<WatchPriceType>;
  /** Weight of the provider */
  weight?: Maybe<Scalars['Int']['output']>;
};

export type QueryRoot = {
  __typename?: 'QueryRoot';
  collections: Array<CollectionSearch>;
  count: Scalars['Int']['output'];
  homeCollection?: Maybe<HomeSearchForCountry>;
  media?: Maybe<Media>;
  preferences?: Maybe<UserPreferences>;
  providers: Array<ProviderSearchForCountry>;
  search: MediaSearchConnection;
};


export type QueryRootcollectionsArgs = {
  country: Scalars['Country']['input'];
  language?: InputMaybe<Scalars['Language']['input']>;
};


export type QueryRootcountArgs = {
  country: Scalars['Country']['input'];
};


export type QueryRoothomeCollectionArgs = {
  country: Scalars['Country']['input'];
  language?: InputMaybe<Scalars['Language']['input']>;
};


export type QueryRootmediaArgs = {
  by: MediaBy;
  country?: InputMaybe<Scalars['Country']['input']>;
  language?: InputMaybe<Scalars['Language']['input']>;
};


export type QueryRootprovidersArgs = {
  country: Scalars['Country']['input'];
  favorites?: InputMaybe<Scalars['Boolean']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
};


export type QueryRootsearchArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  arguments?: InputMaybe<SearchArguments>;
  before?: InputMaybe<Scalars['String']['input']>;
  country: Scalars['Country']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  language?: InputMaybe<Scalars['Language']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  sortKey?: SortKey;
};

export type Ranking = {
  __typename?: 'Ranking';
  points: Scalars['Int']['output'];
  position: Scalars['Int']['output'];
  score: Scalars['Int']['output'];
};

export enum RatingSource {
  IMDB = 'IMDB',
  TMDB = 'TMDB'
}

export enum RoleType {
  ACTOR = 'ACTOR',
  DIRECTOR = 'DIRECTOR',
  EXECUTIVE_PRODUCER = 'EXECUTIVE_PRODUCER',
  FIRST_ASSISTANT_DIRECTOR = 'FIRST_ASSISTANT_DIRECTOR',
  PRODUCER = 'PRODUCER',
  SCRIPT_SUPERVISOR = 'SCRIPT_SUPERVISOR',
  SECOND_ASSISTANT_DIRECTOR = 'SECOND_ASSISTANT_DIRECTOR',
  SECOND_SECOND_ASSISTANT_DIRECTOR = 'SECOND_SECOND_ASSISTANT_DIRECTOR',
  WRITER = 'WRITER'
}

export type SearchArguments = {
  audio?: InputMaybe<Scalars['Language']['input']>;
  collection?: InputMaybe<Scalars['Int']['input']>;
  country?: InputMaybe<Scalars['Country']['input']>;
  featured?: InputMaybe<Scalars['Boolean']['input']>;
  genres?: InputMaybe<Array<Genre>>;
  kind?: InputMaybe<MediaKind>;
  priceTypes?: InputMaybe<Array<WatchPriceType>>;
  providers?: InputMaybe<Array<Scalars['String']['input']>>;
  subtitle?: InputMaybe<Scalars['Language']['input']>;
  withPoster?: InputMaybe<Scalars['Boolean']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export enum SortKey {
  CREATED_AT = 'CREATED_AT',
  ID = 'ID',
  POSITION = 'POSITION',
  RELEASED_AT = 'RELEASED_AT',
  UPDATED_AT = 'UPDATED_AT'
}

export type TVShow = Media & {
  __typename?: 'TVShow';
  availabilities: Array<Availability>;
  backdrop?: Maybe<Scalars['String']['output']>;
  charts: Array<MediaSearch>;
  classification?: Maybe<Scalars['String']['output']>;
  countries: Array<Scalars['Country']['output']>;
  country?: Maybe<Scalars['Country']['output']>;
  createdAt: Scalars['String']['output'];
  genres: Array<Genre>;
  homepage?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  ids: Array<ExternalId>;
  inProduction: Scalars['Boolean']['output'];
  kind: MediaKind;
  languages: Array<Scalars['Language']['output']>;
  lastAirDate?: Maybe<Scalars['String']['output']>;
  overview?: Maybe<Scalars['String']['output']>;
  pochoclinReview?: Maybe<PochoclinReview>;
  poster?: Maybe<Scalars['String']['output']>;
  ranking?: Maybe<Ranking>;
  ratings: Array<ExternalRating>;
  released?: Maybe<Scalars['String']['output']>;
  similars: Array<MediaSearch>;
  slug: Scalars['String']['output'];
  tagline?: Maybe<Scalars['String']['output']>;
  tags: Array<Scalars['Tag']['output']>;
  talents: Array<People>;
  title: Scalars['String']['output'];
  trailers: Array<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
  videos: Array<MediaVideo>;
  year?: Maybe<Scalars['Int']['output']>;
};


export type TVShowavailabilitiesArgs = {
  country: Scalars['Country']['input'];
  format?: InputMaybe<MediaFormat>;
  priceType?: InputMaybe<WatchPriceType>;
};


export type TVShowchartsArgs = {
  country: Scalars['Country']['input'];
  language?: InputMaybe<Scalars['Language']['input']>;
};


export type TVShowpochoclinReviewArgs = {
  language?: InputMaybe<Scalars['Language']['input']>;
};


export type TVShowsimilarsArgs = {
  arguments?: InputMaybe<SearchArguments>;
  country: Scalars['Country']['input'];
  language?: InputMaybe<Scalars['Language']['input']>;
};

export type UserPreferences = {
  __typename?: 'UserPreferences';
  country: Scalars['Country']['output'];
  createdAt: Scalars['DateTime']['output'];
  language: Scalars['Language']['output'];
  userId: Scalars['UUID']['output'];
};

export enum VideoSource {
  RUMBLE = 'RUMBLE',
  YOUTUBE = 'YOUTUBE'
}

export enum WatchPriceType {
  BUY = 'BUY',
  CINEMA = 'CINEMA',
  FLATRATE = 'FLATRATE',
  FREE = 'FREE',
  RENT = 'RENT'
}
