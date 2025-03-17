import { Genre, MediaKind, WatchPriceType } from "@popcorntime/graphql/types";
import { Button } from "@popcorntime/ui/components/button";
import { Checkbox } from "@popcorntime/ui/components/checkbox";
import { Label } from "@popcorntime/ui/components/label";
import {
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	useSidebarFooter,
	useSidebarHeader,
} from "@popcorntime/ui/components/sidebar";
import { defaultFilters, type Filters } from "@popcorntime/ui/lib/medias";
import { cn } from "@popcorntime/ui/lib/utils";
import { Film, Podcast, Tv, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";
import { useGlobalStore } from "@/stores/global";

function compareArrayDiff<T>(a: T[], b: T[]) {
	return a.filter(v => !b.includes(v)).length + b.filter(v => !a.includes(v)).length;
}

export function BrowseSidebarGroup() {
	const { t } = useTranslation();
	const providers = useGlobalStore(state => state.providers.providers);
	const args = useGlobalStore(useShallow(state => state.browse.args));
	const setArgs = useGlobalStore(useShallow(state => state.browse.setArgs));
	const [filters, setFilters] = useState<Filters>(defaultFilters);
	const initialFilters = useRef<Filters | null>(null);

	const resetFilters = useCallback(() => {
		setFilters(defaultFilters);
	}, []);

	const activeFilterCount = useMemo(() => {
		const initial = initialFilters.current;
		if (!initial) return 0;

		let count = 0;

		count += compareArrayDiff(filters.genres, initial.genres);
		count += compareArrayDiff(filters.providers, initial.providers);
		count += compareArrayDiff(filters.kind, initial.kind);
		count += compareArrayDiff(filters.prices, initial.prices);

		return count;
	}, [filters]);

	const defaultFilterCount = useMemo(() => {
		let count = 0;

		count += compareArrayDiff(filters.genres, defaultFilters.genres);
		count += compareArrayDiff(filters.providers, defaultFilters.providers);
		count += compareArrayDiff(filters.kind, defaultFilters.kind);
		count += compareArrayDiff(filters.prices, defaultFilters.prices);

		return count;
	}, [filters]);

	const handleTypeChange = useCallback(
		(kind: MediaKind) => {
			const newType = filters.kind.includes(kind)
				? filters.kind.filter(t => t !== kind)
				: [...filters.kind, kind];

			if (newType.length === 0) {
				toast.error("Please select at least one content type");
				return;
			}

			setFilters({
				...filters,
				kind: newType,
			});
		},
		[filters]
	);

	const handleGenreChange = useCallback(
		(genre: Genre) => {
			const newGenres = filters.genres.includes(genre)
				? filters.genres.filter(g => g !== genre)
				: [...filters.genres, genre];

			setFilters({
				...filters,
				genres: newGenres,
			});
		},
		[filters]
	);

	const handleProvidersChange = useCallback(
		(provider: string) => {
			const newProviders = filters.providers.includes(provider)
				? filters.providers.filter(p => p !== provider)
				: [...filters.providers, provider];

			setFilters({
				...filters,
				providers: newProviders,
			});
		},
		[filters]
	);

	const handlePriceChange = useCallback(
		(priceType: WatchPriceType) => {
			const newPriceTypes = filters.prices.includes(priceType)
				? filters.prices.filter(p => p !== priceType)
				: [...filters.prices, priceType];

			setFilters({
				...filters,
				prices: newPriceTypes,
			});
		},
		[filters]
	);

	useEffect(() => {
		const parsedFilters = {
			genres: args?.genres ?? [],
			kind: args?.kind ? [args.kind] : defaultFilters.kind,
			prices: args?.priceTypes ?? [],
			providers: args?.providers ?? [],
		};
		setFilters(parsedFilters);
		initialFilters.current = parsedFilters;
	}, [args]);

	const applyFilters = useCallback(() => {
		setArgs({
			...args,
			genres: filters.genres,
			kind: filters.kind.length === 1 ? filters.kind[0] : undefined,
			priceTypes: filters.prices,
			providers: filters.providers,
		});
	}, [args, filters, setArgs]);

	useSidebarHeader(
		useMemo(
			() => (
				<SidebarHeader className="border-b group-data-[collapsible=icon]:hidden">
					<div className="flex items-center justify-between p-4">
						<h2 className="text-lg font-semibold">Filters</h2>

						<Button
							variant="outline"
							size="sm"
							onClick={resetFilters}
							className={cn("text-muted-foreground", defaultFilterCount === 0 && "opacity-0")}
						>
							<X />
							Reset
						</Button>
					</div>
				</SidebarHeader>
			),
			[resetFilters, defaultFilterCount]
		)
	);

	useSidebarFooter(
		useMemo(
			() => (
				<SidebarFooter className="border-t p-4 group-data-[collapsible=icon]:hidden">
					<Button onClick={applyFilters} disabled={activeFilterCount === 0} className="w-full">
						Apply Filters
						{activeFilterCount > 0 && (
							<span className="bg-primary-foreground text-primary ml-2 rounded-full px-2 py-0.5 text-xs">
								{activeFilterCount}
							</span>
						)}
					</Button>
				</SidebarFooter>
			),
			[activeFilterCount, applyFilters]
		)
	);

	return (
		<>
			<SidebarGroup className="group-data-[collapsible=icon]:hidden">
				<SidebarMenu>
					<SidebarGroupLabel>Content Type</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenuItem className="space-y-2">
							<div className="flex items-center space-x-2 px-2">
								<Checkbox
									id={MediaKind.MOVIE}
									checked={filters.kind.includes(MediaKind.MOVIE)}
									onCheckedChange={() => handleTypeChange(MediaKind.MOVIE)}
								/>
								<Label htmlFor={MediaKind.MOVIE} className="flex items-center gap-2">
									<Film className="h-4 w-4" /> Movies
								</Label>
							</div>
							<div className="flex items-center space-x-2 px-2">
								<Checkbox
									id={MediaKind.TV_SHOW}
									checked={filters.kind.includes(MediaKind.TV_SHOW)}
									onCheckedChange={() => handleTypeChange(MediaKind.TV_SHOW)}
								/>
								<Label htmlFor={MediaKind.TV_SHOW} className="flex items-center gap-2">
									<Tv className="h-4 w-4" /> TV Shows
								</Label>
							</div>
							<div className="flex items-center space-x-2 px-2">
								<Checkbox disabled id="podcast" />
								<Label htmlFor="podcast" className="flex items-center gap-2">
									<Podcast className="h-4 w-4" /> Podcast <small>(soon)</small>
								</Label>
							</div>
						</SidebarMenuItem>
					</SidebarGroupContent>
				</SidebarMenu>
			</SidebarGroup>

			<SidebarGroup className="group-data-[collapsible=icon]:hidden">
				<SidebarMenu>
					<SidebarGroupLabel>Genres</SidebarGroupLabel>
					<SidebarGroupContent>
						<div className="grid grid-cols-2 gap-2 px-2">
							{Object.values(Genre).map(genre => (
								<div key={genre} className="flex items-center space-x-2">
									<Checkbox
										id={`genre-${genre.toLowerCase()}`}
										checked={filters.genres.includes(genre)}
										onCheckedChange={() => handleGenreChange(genre)}
									/>
									<Label htmlFor={`genre-${genre.toLowerCase()}`} className="truncate">
										<span className="truncate">{t(`genres.${genre}`)}</span>
									</Label>
								</div>
							))}
						</div>
					</SidebarGroupContent>
				</SidebarMenu>
			</SidebarGroup>

			<SidebarGroup className="group-data-[collapsible=icon]:hidden">
				<SidebarMenu>
					<SidebarGroupLabel>Prices</SidebarGroupLabel>
					<SidebarGroupContent>
						<div className="grid grid-cols-2 gap-2 px-2">
							{Object.values(WatchPriceType).map(priceType => (
								<div key={priceType} className="flex items-center space-x-2">
									<Checkbox
										id={`priceType-${priceType.toLowerCase()}`}
										checked={filters.prices.includes(priceType)}
										onCheckedChange={() => handlePriceChange(priceType)}
									/>
									<Label htmlFor={`priceType-${priceType.toLowerCase()}`} className="truncate">
										<span className="truncate">{t(`priceType.${priceType.toLowerCase()}`)}</span>
									</Label>
								</div>
							))}
						</div>
					</SidebarGroupContent>
				</SidebarMenu>
			</SidebarGroup>

			<SidebarGroup className="group-data-[collapsible=icon]:hidden">
				<SidebarMenu>
					<SidebarGroupLabel>Providers</SidebarGroupLabel>
					<SidebarGroupContent>
						<div className="grid grid-cols-2 gap-2 px-2">
							{providers.map(provider => (
								<div key={provider.key} className="flex items-center space-x-2">
									<Checkbox
										id={provider.key}
										checked={filters.providers.includes(provider.key)}
										onCheckedChange={() => handleProvidersChange(provider.key)}
									/>
									<Label htmlFor={provider.key} className="truncate">
										<span className="truncate">{provider.name}</span>
									</Label>
								</div>
							))}
						</div>
					</SidebarGroupContent>
				</SidebarMenu>
			</SidebarGroup>
		</>
	);
}
