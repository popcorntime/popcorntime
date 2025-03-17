import { type Movie, RatingSource, type TVShow, WatchPriceType } from "@popcorntime/graphql/types";
import { type Country, getLocalesForCountry, type Locale } from "@popcorntime/i18n";
import { Badge } from "@popcorntime/ui/components/badge";
import { Button, buttonVariants } from "@popcorntime/ui/components/button";
import { Dialog, DialogContent } from "@popcorntime/ui/components/dialog";
import { MediaPosterAsPicture } from "@popcorntime/ui/components/poster";
import { ScrollArea } from "@popcorntime/ui/components/scroll-area";
import { Spinner } from "@popcorntime/ui/components/spinner";
import { Table, TableBody, TableCell, TableRow } from "@popcorntime/ui/components/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@popcorntime/ui/components/tabs";
import { timeDisplay } from "@popcorntime/ui/lib/time";
import { cn } from "@popcorntime/ui/lib/utils";
import { Calendar, Clock, ExternalLink, Star, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import placeholderImg from "@/assets/placeholder.svg";
import { ProviderIcon, ProviderText } from "@/components/provider";
import { useCountry } from "@/hooks/useCountry";
import { useTauri } from "@/hooks/useTauri";
import { NotFoundRoute } from "@/routes/not-found";
import { useGlobalStore } from "@/stores/global";

function MediaContentSkeleton() {
	return (
		<div className="absolute inset-0 flex h-full w-full items-center justify-center">
			<Spinner />
		</div>
	);
}

function MediaContent() {
	const locale = useGlobalStore(state => state.i18n.locale);
	const slug = useGlobalStore(state => state.dialogs.media.slug);
	const toggle = useGlobalStore(state => state.dialogs.media.toggle);
	const { country } = useCountry();
	const [isLoading, setIsLoading] = useState(false);
	const { invoke } = useTauri();
	const [media, setMedia] = useState<Movie | TVShow | null>(null);
	const { t } = useTranslation();
	const officialLocales = useMemo(() => [...getLocalesForCountry(country)], [country]);

	const fetch = useCallback(
		async (slug: string) => {
			setIsLoading(true);
			const results = await invoke<Movie | TVShow>("media", {
				params: {
					country: country.toUpperCase() as Country,
					slug,
					language: locale,
				},
			});
			setMedia(results);
			setIsLoading(false);
		},
		[country, locale, invoke]
	);

	useEffect(() => {
		if (slug) {
			void fetch(slug);
		}
	}, [fetch, slug]);

	const posterId = useMemo(() => {
		// `/ID.jpg` is the original poster
		if (media?.poster) {
			return media.poster.match(/\/([^/.]+)\./)?.[1];
		}
	}, [media?.poster]);

	const backdropId = useMemo(() => {
		// `/ID.jpg` is the original backdrop
		if (media?.backdrop) {
			return media.backdrop.match(/\/([^/.]+)\./)?.[1];
		}
	}, [media?.backdrop]);

	const bestProviders = useMemo(() => {
		if (!media?.availabilities) {
			return [];
		}
		const bestProvider = [...media.availabilities];

		// sort bestProvider  with free provider first, then subscription then others by weight
		bestProvider.sort((a, b) => {
			if (a.pricesType?.includes(WatchPriceType.FREE)) {
				return -1;
			}
			if (b.pricesType?.includes(WatchPriceType.FREE)) {
				return 1;
			}
			if (a.pricesType?.includes(WatchPriceType.FLATRATE)) {
				return -1;
			}
			if (b.pricesType?.includes(WatchPriceType.FLATRATE)) {
				return 1;
			}
			// default
			return a.providerName.localeCompare(b.providerName);
		});

		if (bestProvider.length >= 3) {
			return bestProvider.slice(0, 3);
		}

		if (bestProvider.length > 0 && media.availabilities.length < 3) {
			const missing = 3 - bestProvider.length;
			const rest = media.availabilities.filter(
				availability =>
					!bestProvider.find(filtered => filtered.providerId === availability.providerId)
			);
			return [...bestProvider, ...rest.slice(0, missing)];
		}

		return media.availabilities.slice(0, 3);
	}, [media?.availabilities]);

	const bestProvider = useMemo(() => {
		if (bestProviders && bestProviders.length > 0) {
			return bestProviders[0];
		}
	}, [bestProviders]);

	const imdbRating = useMemo(() => {
		return media?.ratings?.find(rating => rating.source === RatingSource.IMDB && rating.rating > 0);
	}, [media?.ratings]);

	const allLanguages = useMemo(() => {
		if (!media?.availabilities) {
			return [];
		}
		return Array.from(
			media.availabilities.reduce((acc, availability) => {
				availability.audioLanguages
					?.filter(l => officialLocales.includes(l))
					.forEach(lang => {
						acc.add(lang);
					});
				return acc;
			}, new Set<Locale>())
		);
	}, [media?.availabilities, officialLocales]);

	const allSubtitles = useMemo(() => {
		if (!media?.availabilities) {
			return [];
		}
		return Array.from(
			media.availabilities.reduce((acc, availability) => {
				availability.subtitleLanguages
					?.filter(l => officialLocales.includes(l))
					.filter((a: Locale) => !allLanguages.includes(a))
					.forEach(lang => {
						acc.add(lang);
					});
				return acc;
			}, new Set<Locale>())
		);
	}, [media?.availabilities, officialLocales, allLanguages]);

	if (isLoading) return <MediaContentSkeleton />;
	if (!media) return <NotFoundRoute />;

	return (
		<>
			<section className="relative h-80 overflow-hidden rounded-md">
				<div className="absolute inset-0 flex items-end">
					{backdropId && (
						<>
							<picture
								className={cn(
									"h-full w-full transition-opacity duration-500",
									"opacity-100 portrait:mix-blend-multiply"
								)}
							>
								<source
									srcSet={`https://img.popcorntime.app/o/${backdropId}.webp`}
									media="(min-width: 960px)"
									type="image/webp"
								/>
								<source
									srcSet={`https://img.popcorntime.app/o/${backdropId}@960.webp`}
									type="image/webp"
								/>
								<source
									srcSet={`https://img.popcorntime.app/o/${backdropId}.jpg`}
									media="(min-width: 960px)"
									type="image/jpeg"
								/>
								<source
									srcSet={`https://img.popcorntime.app/o/${backdropId}@960.jpg`}
									type="image/jpeg"
								/>
								<img
									src={`https://img.popcorntime.app/o/${backdropId}.jpg`}
									alt={media.title}
									className="aspect-[16/9] h-full w-full object-cover"
									loading="eager"
									fetchPriority="high"
								/>
							</picture>
							<div className="from-background via-background/60 absolute inset-0 bg-gradient-to-t to-transparent" />
							<div className="from-background/80 to-background/40 absolute inset-0 bg-gradient-to-r via-transparent" />
						</>
					)}

					<Button
						variant="ghost"
						size="icon"
						onClick={toggle}
						className="absolute top-4 right-4 z-[500] text-white/80 backdrop-blur-sm hover:bg-black/30 hover:text-white"
					>
						<X className="h-6 w-6" />
					</Button>
				</div>

				<div className="absolute right-0 bottom-0 left-0 px-8">
					<div className="flex h-full items-stretch gap-6">
						<MediaPosterAsPicture
							loading="lazy"
							title={media.title}
							posterId={posterId}
							placeholder={placeholderImg}
							className="w-32 rounded-md"
						/>
						<div className="flex flex-1 flex-col pb-4">
							<h1 className="mb-3 line-clamp-1 text-4xl leading-tight font-bold">{media.title}</h1>

							<div className="mb-4 flex flex-wrap items-center gap-6">
								<div className="flex items-center gap-2">
									<Star className="h-5 w-5 fill-current text-yellow-400" />
									{media.ranking?.score && (
										<span className="text-lg font-semibold">{media.ranking?.score}</span>
									)}
									{imdbRating && (
										<span className="text-muted-foreground text-sm">
											({imdbRating.rating.toFixed(2)} IMDb)
										</span>
									)}
								</div>
								<div className="text-muted-foreground flex items-center gap-2">
									<Calendar className="h-4 w-4" />
									<span>{media.year}</span>
								</div>
								{media.__typename === "Movie" && media.runtime && Number(media.runtime) > 0 && (
									<div className="text-muted-foreground flex items-center gap-2">
										<Clock className="h-4 w-4" />
										<span className="">{timeDisplay(media.runtime)}</span>
									</div>
								)}
							</div>

							<div className="mb-4 flex flex-wrap gap-2">
								<Badge variant="default" className="font-medium capitalize backdrop-blur-sm">
									{media.__typename === "Movie" ? t("media.movie") : t("media.tv-show")}
								</Badge>

								{media.genres.map(genre => (
									<Badge
										key={genre}
										variant="outline"
										className="border-white/30 bg-black/20 backdrop-blur-sm"
									>
										{t(`genres.${genre}`)}
									</Badge>
								))}
							</div>

							{bestProvider && (
								<div className="mt-auto flex flex-col space-y-2 space-x-0 sm:flex-row sm:space-y-0 sm:space-x-2 rtl:space-x-reverse">
									<Link
										className={cn(
											buttonVariants({ variant: "default", size: "xl" }),
											"group bg-primary/40 dark:bg-primary/20 hover:bg-primary/90 hover:text-secondary flex w-full items-center justify-center gap-x-2 px-4 font-extrabold sm:w-auto sm:max-w-sm"
										)}
										to={`https://go.popcorntime.app/${bestProvider.urlHash}?country=${country?.toUpperCase()}`}
										target="_blank"
									>
										<ProviderIcon
											alt={bestProvider.providerName}
											className="w-6 rounded-md"
											icon={bestProvider.logo}
										/>
										<div className="max-w-sm truncate text-lg">
											<ProviderText availability={bestProvider} />
										</div>
									</Link>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>
			<section className="border-border/30 min-h-0 flex-1 overflow-hidden border-t px-8 pt-3">
				<Tabs defaultValue="links" className="flex h-full min-h-0 flex-col">
					<TabsList>
						<TabsTrigger value="links">{t("mediaTabs.links")}</TabsTrigger>
						<TabsTrigger value="overview">{t("mediaTabs.overview")}</TabsTrigger>
					</TabsList>
					<div className="mb-8 min-h-0 flex-1">
						<TabsContent asChild value="links">
							<ScrollArea className="h-full py-4">
								<Table>
									<TableBody>
										{media.availabilities.map(availability => {
											return (
												<TableRow
													key={availability.providerId}
													className="border-gray-700/30 transition-colors hover:bg-gray-800/40"
												>
													<TableCell className="py-4">
														<div className="flex items-center gap-3">
															<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-700/50 text-lg">
																<ProviderIcon className="rounded-md" icon={availability.logo} />
															</div>
															<span className="font-medium">{availability.providerName}</span>
														</div>
													</TableCell>
													<TableCell className="max-w-[20vw] align-middle">
														<div className="flex flex-wrap items-center gap-2">
															{availability.pricesType?.map(type => (
																<Badge
																	key={type}
																	variant="outline"
																	className="border-current/30 bg-current/10"
																>
																	{t(`priceType.${type.toLowerCase()}`)}
																</Badge>
															))}
														</div>
													</TableCell>

													<TableCell className="text-right">
														<Link
															to={`https://go.popcorntime.app/${availability.urlHash}?country=${country?.toUpperCase()}`}
															target="_blank"
															className={cn(
																"transition-colors",
																buttonVariants({
																	variant: "ghost",
																	size: "sm",
																})
															)}
														>
															<ExternalLink className="mr-2 h-4 w-4" />
															<span>{t("mediaActions.open")}</span>
														</Link>
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</ScrollArea>
						</TabsContent>
						<TabsContent value="overview" asChild>
							<ScrollArea className="flex h-full space-y-12">
								{media.overview && <p className="text-pretty">{media.overview}</p>}

								<div className={cn("grid grid-cols-2 gap-8", media.overview && "mt-4")}>
									<div className="space-y-4">
										<h4 className="text-lg font-semibold">Details</h4>
										<div className="space-y-3 text-sm">
											{allLanguages && allLanguages.length > 0 && (
												<div className="flex justify-between">
													<span className="text-muted-foreground">Audios:</span>
													<span>
														{allLanguages.map(locale => t(`language.${locale}`)).join(", ")}
													</span>
												</div>
											)}

											{allSubtitles && allSubtitles.length > 0 && (
												<div className="flex justify-between">
													<span className="text-muted-foreground">Subtitles:</span>
													<span>
														{allSubtitles.map(locale => t(`language.${locale}`)).join(", ")}
													</span>
												</div>
											)}

											{media.country && (
												<div className="flex justify-between">
													<span className="text-muted-foreground">Country:</span>
													<span>{t(`country.${media.country.toLowerCase()}`)}</span>
												</div>
											)}
										</div>
									</div>

									<div className="space-y-4">
										<h4 className="text-lg font-semibold">Ratings</h4>
										<div className="space-y-3">
											{media.ranking?.score && (
												<div className="flex items-center justify-between">
													<span className="text-muted-foreground">Popcorn Time Score</span>
													<div className="flex items-center gap-2">
														<Star className="h-4 w-4 fill-current text-yellow-400" />
														<span className="font-semibold">{media.ranking.score}/100</span>
													</div>
												</div>
											)}

											{imdbRating && (
												<div className="flex items-center justify-between">
													<span className="text-muted-foreground">IMDb</span>
													<span className="font-medium">{imdbRating.rating.toFixed(2)}/10</span>
												</div>
											)}
										</div>
									</div>
								</div>
							</ScrollArea>
						</TabsContent>
					</div>
				</Tabs>
			</section>
		</>
	);
}

export function MediaDialog() {
	const isOpen = useGlobalStore(state => state.dialogs.media.isOpen);
	const toggle = useGlobalStore(state => state.dialogs.media.toggle);

	return (
		<Dialog open={isOpen} onOpenChange={toggle} modal>
			<DialogContent className="z-[300] h-full w-full max-w-2xl border-0 p-0 outline-none md:max-h-[90vh] lg:max-w-4xl">
				<div
					className={cn(
						"flex min-h-[calc(100vh-(12rem))] flex-col transition-all duration-300",
						"translate-y-0 opacity-100",
						"ease-[cubic-bezier(0.25, 1, 0.5, 1)]"
					)}
				>
					<div className="absolute top-0 left-0 z-400 h-14 w-full" data-tauri-drag-region></div>
					<MediaContent />
				</div>
			</DialogContent>
		</Dialog>
	);
}
