import { type MediaKind, type MediaSearch, SortKey } from "@popcorntime/graphql/types";
import { BrowseMedias } from "@popcorntime/ui/blocks/browse";
import { useSidebar, useSidebarGroup } from "@popcorntime/ui/components/sidebar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useLocation, useParams } from "react-router";
import placeholderImg from "@/assets/placeholder.svg";
import { BrowseSidebarGroup } from "@/components/browse/sidebar";
import { useCountry } from "@/hooks/useCountry";
import { type SearchParams, useSearch } from "@/hooks/useSearch";
import { useGlobalStore } from "@/stores/global";

const SORTS = [
	{ key: SortKey.POSITION, label: "popularity" },
	{ key: SortKey.UPDATED_AT, label: "updated" },
] as const;

export function BrowseRoute() {
	const { country } = useCountry();
	const initialized = useGlobalStore(state => state.app.initialized);
	const globalArgs = useGlobalStore(state => state.browse.args);
	const sortKey = useGlobalStore(state => state.browse.sortKey);
	const query = useGlobalStore(state => state.browse.query);
	const openMediaDialog = useGlobalStore(state => state.dialogs.media.open);
	const { t } = useTranslation();
	const [dataAccumulator, setDataAccumulator] = useState<MediaSearch[]>([]);
	const { setOpen: setOpenSidebar } = useSidebar();
	const { pathname } = useLocation();
	const { kind } = useParams<{ kind: "movie" | "tv_show" }>();
	const setSortKey = useGlobalStore(state => state.browse.setSortKey);

	const args = useMemo(() => {
		return {
			...globalArgs,
			kind: kind?.toUpperCase() as MediaKind | undefined,
		};
	}, [globalArgs, kind]);
	const prevQuery = useRef([query, args, sortKey]);
	const prevPathname = useRef(pathname);

	const sortKeys = useMemo(
		() =>
			SORTS.map(sort => {
				return {
					key: sort.key,
					label: t(`sortBy.${sort.label}`),
					current: sort.key === sortKey,
				};
			}),
		[sortKey, t]
	);

	// Register the sidebar group for this route
	useSidebarGroup(useMemo(() => <BrowseSidebarGroup />, []));

	const [browseParams, setBrowseParams] = useState<SearchParams>({
		limit: 50,
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
			return {
				...prev,
				cursor,
			};
		});
	}, [hasNextPage, cursor]);

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
			prevQuery.current[0] === query &&
			prevQuery.current[1] === args &&
			prevQuery.current[2] === sortKey
		)
			return;
		prevQuery.current = [query, args, sortKey];
		setBrowseParams(prev => {
			return {
				...prev,
				query: query,
				arguments: args,
				sortKey: sortKey,
				// reset cursor when query changes
				cursor: undefined,
			};
		});
	}, [query, args, sortKey]);

	// FIXME: allow filter for TV SHOW
	useEffect(() => {
		if (prevPathname.current === pathname) return;
		prevPathname.current = pathname;
		// always close the sidebar when browsing
		// as tv show currently doesn't support it
		setOpenSidebar(false);
	}, [setOpenSidebar, pathname]);

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
			onOpen={openMediaDialog}
			placeholder={placeholderImg}
			isReady={!isLoading && initialized && dataAccumulator.length > 0}
			isLoading={isLoading}
			onLoadMore={onLoadMore}
			onSortChange={setSortKey}
			sortKeys={sortKeys}
			translations={{
				free: t("media.free"),
				kind: {
					movie: t("media.movie"),
					tvShow: t("media.tv-show"),
				},
				loading: t("browse.loading"),
				loadMore: t("browse.load-more"),
				sortBy: t("sortBy.label"),
			}}
		/>
	);
}
