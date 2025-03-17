import {
  Genre,
  MediaKind,
  SearchArguments,
  SortKey,
  WatchPriceType,
} from "@popcorntime/graphql/types";

export type Filters = {
  kind: Array<MediaKind>;
  genres: Array<Genre>;
  providers: Array<string>;
  prices: Array<WatchPriceType>;
};

export const defaultFilters: Filters = {
  kind: [MediaKind.MOVIE, MediaKind.TV_SHOW],
  genres: [],
  providers: [],
  prices: [],
};

export function buildFiltersFromSearchParams(params: URLSearchParams) {
  const filters: Filters = {
    kind: [],
    genres: [],
    providers: [],
    prices: [],
  };

  if (params.get("kind")) {
    filters.kind = params.get("kind")?.split(",") as MediaKind[];
  } else {
    filters.kind = [MediaKind.MOVIE, MediaKind.TV_SHOW];
  }

  if (params.get("genres")) {
    filters.genres = params.get("genres")?.split(",") as Genre[];
  }
  if (params.get("providers")) {
    filters.providers = params.get("providers")?.split(",") ?? [];
  }
  if (params.get("prices")) {
    filters.prices = params.get("prices")?.split(",") as WatchPriceType[];
  }
  return filters;
}

export function buildUrlFromFilters(filters: Filters) {
  const url = new URLSearchParams();
  if (
    filters.kind.length > 0 &&
    filters.kind.length < Object.values(MediaKind).length
  ) {
    url.set("kind", filters.kind.join(","));
  }
  if (filters.genres.length > 0) {
    url.set("genres", filters.genres.join(","));
  }
  if (filters.providers.length > 0) {
    url.set("providers", filters.providers.join(","));
  }
  if (filters.prices.length > 0) {
    url.set("prices", filters.prices.join(","));
  }
  return url;
}

export function buildMediaQuery(
  kind: MediaKind,
  favoriteProviders: string[],
  params: URLSearchParams
) {
  const cursor = params.get("cursor") ?? undefined;
  const query = params.get("query") ?? undefined;
  let sortKey = params.get("sort_by")?.toUpperCase();

  const genres: Genre[] =
    (params.get("genres")?.split(",") as Genre[] | undefined) ?? [];
  const priceTypes: WatchPriceType[] =
    (params.get("prices")?.split(",") as WatchPriceType[]) ?? [];
  const providers = [
    ...favoriteProviders,
    ...(params.get("providers")?.split(",") ?? []),
  ];

  if (
    !sortKey ||
    (sortKey && !Object.values(SortKey).includes(sortKey as SortKey))
  ) {
    sortKey = SortKey.POSITION;
  }

  return {
    query,
    cursor,
    sortKey: sortKey as SortKey,
    args: {
      genres,
      kind,
      providers,
      priceTypes,
      withPoster: true,
    } as SearchArguments,
  };
}
