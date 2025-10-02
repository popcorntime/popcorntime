import { Button } from "@popcorntime/ui/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "@popcorntime/ui/components/popover";
import { Poster, PosterSkeleton } from "@popcorntime/ui/components/poster";
import { ToggleGroup, ToggleGroupItem } from "@popcorntime/ui/components/toggle-group";
import { cn } from "@popcorntime/ui/lib/utils";
import { ArrowUp, SlidersHorizontal } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/shallow";
import { type SortOrder, useGlobalStore } from "@/stores/global";
import type { MediaSearch, SortKey } from "@/tauri/types";

const SORTS = [
	{ key: "POSITION", label: "popularity", defaultSort: "ASC" },
	{ key: "UPDATED_AT", label: "updated", defaultSort: "DESC" },
] as const;

export function BrowseSortBy() {
	const { sortKey, sortOrder } = useGlobalStore(useShallow(state => state.browse));
	const browseUpdate = useGlobalStore(state => state.browseUpdate);
	const { t } = useTranslation();

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

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="secondary"
					size="sm"
					className="bg-background/70 hover:bg-background pointer-events-auto h-8 rounded-full px-3 shadow backdrop-blur"
					aria-label="Sort"
					title="Sort (S)"
				>
					<SlidersHorizontal className="mr-2 size-4" />
					<span className="hidden sm:inline">{t("sortBy.label")}</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-fit">
				<ToggleGroup
					type="single"
					value={sortKey}
					onValueChange={v => {
						if (!v) return;
						const sort = SORTS.find(s => s.key === v);
						browseUpdate({ sortKey: v as SortKey, sortOrder: sort?.defaultSort as SortOrder });
					}}
					className="grid grid-cols-2"
				>
					{sortKeys.map(s => (
						<ToggleGroupItem
							variant="outline"
							size="sm"
							key={s.key}
							value={s.key}
							className="justify-start text-xs group "
							aria-label={s.label}
							onClick={e => {
								e.stopPropagation();
								browseUpdate({ sortOrder: sortOrder === "ASC" ? "DESC" : "ASC" });
							}}
						>
							<ArrowUp
								className={cn(
									"transition-transform group-hover:text-muted-foreground/80",
									sortOrder === "DESC" && "rotate-180",
									!s.current ? "opacity-0" : "opacity-100"
								)}
							/>
							<span className="group-hover:text-muted-foreground/80">{s.label}</span>
						</ToggleGroupItem>
					))}
				</ToggleGroup>
			</PopoverContent>
		</Popover>
	);
}

interface BrowseMediasProps {
	sentryRef: React.Ref<HTMLDivElement> | undefined;
	isLoading: boolean;
	isReady: boolean;
	medias: MediaSearch[];
	onOpen(slug: string): void;
	onLoadMore(): void;
	placeholder: string;
}

export function BrowseMedias({
	isLoading,
	isReady,
	medias,
	onOpen,
	placeholder,
	onLoadMore,
	sentryRef,
}: BrowseMediasProps) {
	const { t } = useTranslation();

	return (
		<div className="h-full w-full overflow-y-auto">
			<ul className="grid grid-cols-4 md:md:grid-cols-5 lg:md:grid-cols-6 xl:md:grid-cols-7 2xl:md:grid-cols-10">
				{!isReady && medias.length === 0
					? Array.from({ length: 50 }).map((_, i) => (
							<li
								key={`skeleton-${
									// biome-ignore lint/suspicious/noArrayIndexKey: skeleton
									i
								}`}
							>
								<PosterSkeleton />
							</li>
						))
					: medias.map(media => (
							<li key={media.id}>
								<button
									type="button"
									onClick={() => onOpen(media.slug)}
									className="block h-full w-full appearance-none border-0 bg-transparent p-0 text-left leading-none rtl:text-right"
								>
									<Poster
										media={media}
										placeholder={placeholder}
										withFreeBadge={
											media.providers.find(provider => provider.priceTypes.includes("FREE")) !==
											undefined
										}
										translations={{
											free: t("media.free"),
											kind: media.kind === "MOVIE" ? t("media.movie") : t("media.tv-show"),
										}}
									/>
								</button>
							</li>
						))}
			</ul>

			<div className="pointer-events-none fixed top-15 right-3 z-50">
				<BrowseSortBy />
			</div>

			<div className="relative" ref={sentryRef}>
				<div className="mt-8 flex justify-center">
					<Button
						disabled={isLoading}
						className={cn("mx-4 block", medias.length === 0 && "hidden")}
						variant="link"
						size="sm"
						onClick={onLoadMore}
					>
						{isLoading ? t("browse.loading") : t("browse.load-more")}
					</Button>
				</div>
			</div>
		</div>
	);
}
