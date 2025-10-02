import { useCallback, useEffect, useRef, useState } from "react";
import isEqual from "react-fast-compare";
import { useDebounce } from "use-debounce";
import { useTauri } from "@/hooks/useTauri";
import type { MediaSearch, MediaSearchConnection, PageInfo, SearchInput } from "@/tauri/types";

export type SearchResults = {
	nodes: Array<MediaSearch>;
	pageInfo: PageInfo;
};

export function useSearch(
	params: SearchInput & { enabled?: boolean },
	onChange?: (params: SearchInput) => void
) {
	const { api } = useTauri();
	const [data, setData] = useState<MediaSearchConnection | null>(null);
	const [debouncedParams] = useDebounce(params, 300);
	const [isLoading, setIsLoading] = useState(false);
	const prevParams = useRef<SearchInput | undefined>(undefined);
	const enabled = params.enabled !== false;

	const fetch = useCallback(async () => {
		if (
			!isEqual(debouncedParams.arguments, prevParams.current?.arguments) ||
			debouncedParams.query !== prevParams.current?.query ||
			debouncedParams.country !== prevParams.current?.country ||
			debouncedParams.language !== prevParams.current?.language ||
			debouncedParams.sortKey !== prevParams.current?.sortKey ||
			debouncedParams.first !== prevParams.current?.first ||
			debouncedParams.last !== prevParams.current?.last
		) {
			onChange?.(debouncedParams);
		}

		// sort updated AT by `
		prevParams.current = debouncedParams;

		setIsLoading(true);

		const results = await api.searchMedias(debouncedParams);
		if (results) {
			setData(results.search);
		}
		setIsLoading(false);
	}, [debouncedParams, api.searchMedias, onChange]);

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
