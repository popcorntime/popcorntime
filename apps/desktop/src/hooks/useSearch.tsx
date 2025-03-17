import {
	type MediaSearch,
	type PageInfo,
	type SearchArguments,
	SortKey,
} from "@popcorntime/graphql/types";
import type { Country, Locale } from "@popcorntime/i18n";
import { useCallback, useEffect, useRef, useState } from "react";
import isEqual from "react-fast-compare";
import { useDebounce } from "use-debounce";
import { useTauri } from "@/hooks/useTauri";

export type SearchParams = {
	limit?: number;
	cursor?: string;
	country?: Country;
	language?: Locale;
	query?: string;
	arguments?: SearchArguments;
	sortKey?: SortKey;
	enabled?: boolean;
};

export type SearchResults = {
	nodes: Array<MediaSearch>;
	pageInfo: PageInfo;
};

// reverted pagination for 'updated at'
function toInput(p: SearchParams) {
	const limit = p.limit ?? 24;
	const sort = p.sortKey;
	const reverse = sort === SortKey.UPDATED_AT;
	return {
		...p,
		...(reverse
			? { last: limit, before: p.cursor || undefined }
			: { first: limit, after: p.cursor || undefined }),
	};
}

export function useSearch(params: SearchParams, onChange?: (params: SearchParams) => void) {
	const { invoke } = useTauri();
	const [data, setData] = useState<null | SearchResults>(null);
	const [debouncedParams] = useDebounce(params, 300);
	const [isLoading, setIsLoading] = useState(false);
	const prevParams = useRef<SearchParams | undefined>(undefined);
	const enabled = params.enabled !== false;

	const fetch = useCallback(async () => {
		if (
			!isEqual(debouncedParams.arguments, prevParams.current?.arguments) ||
			debouncedParams.query !== prevParams.current?.query ||
			debouncedParams.country !== prevParams.current?.country ||
			debouncedParams.language !== prevParams.current?.language ||
			debouncedParams.sortKey !== prevParams.current?.sortKey
		) {
			onChange?.(debouncedParams);
		}

		// sort updated AT by `
		prevParams.current = debouncedParams;

		setIsLoading(true);

		const results = await invoke<SearchResults>("search_medias", {
			params: toInput(debouncedParams),
		});
		setData(results ?? null);
		setIsLoading(false);
	}, [debouncedParams, invoke, onChange]);

	useEffect(() => {
		if (!debouncedParams || !enabled) return;
		if (isEqual(debouncedParams, prevParams.current)) return;
		if (!debouncedParams.country) return;

		fetch();
	}, [debouncedParams, fetch, enabled]);

	return {
		isLoading,
		data,
		fetch,
		reset: () => {
			setData(null);
			setIsLoading(false);
		},
	};
}
