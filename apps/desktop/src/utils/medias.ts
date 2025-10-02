import type { Genre, MediaKind, SearchArguments, SortKey, WatchPriceType } from "@/tauri/types";

export type Filters = {
	kind: Array<MediaKind>;
	genres: Array<Genre>;
	providers: Array<string>;
	prices: Array<WatchPriceType>;
};

export const defaultFilters: Filters = {
	kind: ["MOVIE", "TV_SHOW"],
	genres: [],
	providers: [],
	prices: [],
};

export const validSortKeys: SortKey[] = [
	"ID",
	"RELEASED_AT",
	"CREATED_AT",
	"UPDATED_AT",
	"POSITION",
];

export const GENRES = [
	"ACTION",
	"ADVENTURE",
	"ANIMATION",
	"COMEDY",
	"CRIME",
	"DOCUMENTARY",
	"DRAMA",
	"FAMILY",
	"FANTASY",
	"HISTORY",
	"HORROR",
	"MUSIC",
	"MYSTERY",
	"ROMANCE",
	"SCIENCE_FICTION",
	"TV_MOVIE",
	"THRILLER",
	"WAR",
	"WESTERN",
	"OTHER",
] as const satisfies readonly Genre[];

export const WATCH_PRICE_TYPES = [
	"BUY",
	"CINEMA",
	"FLATRATE",
	"FREE",
	"RENT",
] as const satisfies readonly WatchPriceType[];

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
		filters.kind = ["MOVIE", "TV_SHOW"];
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
	if (filters.kind.length > 0) {
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

	const rawSortKey = params.get("sort_by")?.toUpperCase() as SortKey | undefined;
	const sortKey: SortKey =
		rawSortKey && validSortKeys.includes(rawSortKey) ? rawSortKey : "POSITION";

	const genres: Genre[] = (params.get("genres")?.split(",") as Genre[] | undefined) ?? [];
	const priceTypes: WatchPriceType[] = (params.get("prices")?.split(",") as WatchPriceType[]) ?? [];
	const providers = [...favoriteProviders, ...(params.get("providers")?.split(",") ?? [])];

	const args = {
		genres,
		kind,
		providers,
		priceTypes,
		withPoster: true,
	} satisfies SearchArguments;

	return {
		query,
		cursor,
		sortKey,
		args,
	};
}
