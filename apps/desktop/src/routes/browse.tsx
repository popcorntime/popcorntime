import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useParams } from "react-router";
import { useShallow } from "zustand/shallow";
import placeholderImg from "@/assets/placeholder.svg";
import { BrowseMedias } from "@/components/browse";
import { useCountry } from "@/hooks/useCountry";
import { useSearch } from "@/hooks/useSearch";
import { useGlobalStore } from "@/stores/global";
import type { MediaKind, MediaSearch, SearchInput } from "@/tauri/types";

export function BrowseRoute() {
	const { country } = useCountry();
	const appBoot = useGlobalStore(state => state.app.boot);
	const {
		args: globalArgs,
		sortKey,
		sortOrder,
		query,
	} = useGlobalStore(useShallow(state => state.browse));

	const openMedia = useGlobalStore(state => state.openMedia);
	const [dataAccumulator, setDataAccumulator] = useState<MediaSearch[]>([]);
	const { kind } = useParams<{ kind: "movie" | "tv_show" }>();

	const args = useMemo(() => {
		return {
			...globalArgs,
			kind: kind?.toUpperCase() as MediaKind | undefined,
		};
	}, [globalArgs, kind]);

	const prevQuery = useRef<{
		q: typeof query;
		a: typeof args;
		k: typeof sortKey;
		o: typeof sortOrder;
	}>({
		q: query,
		a: args,
		k: sortKey,
		o: sortOrder,
	});

	// Register the sidebar group for this route
	//useSidebarGroup(useMemo(() => <BrowseSidebarGroup />, []));

	const [browseParams, setBrowseParams] = useState<SearchInput>({
		first: 50,
		country: country,
		sortKey: sortKey,
		arguments: args,
		query: query,
	});

	const { data, isLoading } = useSearch(browseParams, () => {
		setDataAccumulator([]);
	});

	const hasNextPage = useMemo(
		() => data?.pageInfo.hasNextPage ?? false,
		[data?.pageInfo.hasNextPage]
	);

	const cursor = useMemo(() => data?.pageInfo.endCursor ?? null, [data?.pageInfo.endCursor]);

	useEffect(() => {
		setBrowseParams(prev => {
			return {
				...prev,
				country,
			};
		});
	}, [country]);

	const onLoadMore = useCallback(async () => {
		if (!hasNextPage || !cursor) return;
		setBrowseParams(prev => {
			let innerCursor:
				| { after?: string | null; first?: number | null }
				| { before?: string | null; last?: number | null } = {
				after: cursor,
				first: prev.first ?? prev.last ?? 50,
				before: undefined,
				last: undefined,
			};

			if (sortOrder === "DESC") {
				innerCursor = {
					before: cursor,
					last: prev.last ?? prev.first ?? 50,
					first: undefined,
					after: undefined,
				};
			}
			return {
				...prev,
				...innerCursor,
			};
		});
	}, [sortOrder, hasNextPage, cursor]);

	useEffect(() => {
		if (data) {
			setDataAccumulator(prev => {
				const newData = data.nodes.filter(node => !prev.some(existing => existing.id === node.id));
				return [...prev, ...newData];
			});
		}
	}, [data]);

	useEffect(() => {
		if (
			prevQuery.current.q === query &&
			prevQuery.current.a === args &&
			prevQuery.current.k === sortKey &&
			prevQuery.current.o === sortOrder
		) {
			return;
		}

		setBrowseParams(prev => {
			let innerCursor: { first?: number | null } | { last?: number | null } = {
				first: prev.first ?? prev.last ?? 50,
			};

			if (sortOrder === "DESC") {
				innerCursor = {
					last: prev.last ?? prev.first ?? 50,
				};
			}

			return {
				...prev,
				query: query,
				arguments: args,
				sortKey: sortKey,
				after: undefined,
				before: undefined,
				first: undefined,
				last: undefined,
				...innerCursor,
			};
		});

		prevQuery.current = {
			q: query,
			a: args,
			k: sortKey,
			o: sortOrder,
		};
	}, [query, args, sortKey, sortOrder]);

	const [sentryRef] = useInfiniteScroll({
		loading: isLoading,
		hasNextPage,
		onLoadMore,
		rootMargin: "0px 0px 500px 0px",
	});

	return (
		<BrowseMedias
			sentryRef={sentryRef}
			medias={dataAccumulator}
			onOpen={openMedia}
			placeholder={placeholderImg}
			isReady={!isLoading && appBoot === "booted" && dataAccumulator.length > 0}
			isLoading={isLoading}
			onLoadMore={onLoadMore}
		/>
	);
}
