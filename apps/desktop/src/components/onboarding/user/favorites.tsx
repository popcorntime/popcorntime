import { Button, buttonVariants } from "@popcorntime/ui/components/button";
import { Input } from "@popcorntime/ui/components/input";
import { MediaPosterAsPicture } from "@popcorntime/ui/components/poster";
import { cn } from "@popcorntime/ui/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Film, Heart, Search, ThumbsDown, ThumbsUp, Tv } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useCountry } from "@/hooks/useCountry";
import { useSearch } from "@/hooks/useSearch";
import { useTauri } from "@/hooks/useTauri";
import { useGlobalStore } from "@/stores/global";
import type { MediaKind, MediaSearch, UserReactionType } from "@/tauri/types";

type MediaKindKey = Lowercase<MediaKind> | "all";
interface MediaKindInfo {
	filter: MediaKind | undefined;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}
export const mediaKinds: Record<MediaKindKey, MediaKindInfo> = {
	movie: { filter: "MOVIE", icon: Film },
	tv_show: { filter: "TV_SHOW", icon: Tv },
	all: { filter: undefined, icon: Search },
};

export function OnboardingFavorites() {
	const { t } = useTranslation();
	const [searchQuery, setSearchQuery] = useState("");
	const direction = useGlobalStore(state => state.i18n.direction);
	const [activeCategory, setActiveCategory] = useState<MediaKindKey>("all");
	const locale = useGlobalStore(state => state.i18n.locale);
	const { country } = useCountry();
	const { api } = useTauri();
	const [displayedNodes, setDisplayedNodes] = useState<MediaSearch[]>([]);
	const [reactedIds, setReactedIds] = useState<Set<number>>(new Set());

	const { data } = useSearch({
		country,
		query: searchQuery.trim(),
		arguments: {
			kind: mediaKinds[activeCategory].filter,
			withPoster: true,
		},
		language: locale,
		sortKey: "POSITION",
		first: 48,
	});

	const filteredNodes = useMemo(() => data?.nodes.filter(m => m.poster !== null), [data?.nodes]);

	useEffect(() => {
		setDisplayedNodes(filteredNodes?.filter(n => !reactedIds.has(n.id)) || []);
	}, [filteredNodes, reactedIds]);

	const handleReaction = useCallback(
		(mediaId: number, reaction: UserReactionType) => {
			api
				.setMediaReaction({
					mediaId,
					reaction,
				})
				.catch(console.error)
				.finally(() => setReactedIds(prev => new Set(prev).add(mediaId)));
		},
		[api]
	);

	return (
		<div className="h-screen max-h-screen flex flex-col">
			<header className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
				<div className="mx-auto w-full max-w-6xl px-6 py-6 mt-10">
					<div className="text-center space-y-3">
						<div className="hidden lg:flex w-14 h-14 mx-auto bg-primary/20 rounded-full  items-center justify-center">
							<Heart className="w-7 h-7 text-primary" />
						</div>
						<h2 className="text-3xl font-bold text-foreground">{t("onboardingFavorites.title")}</h2>
						<p className="text-muted-foreground text-pretty max-w-2xl mx-auto">
							{t("onboardingFavorites.description")}
						</p>

						<div className="mt-4 grid gap-3 lg:gap-6">
							<div className="relative max-w-md mx-auto w-full">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
								<Input
									placeholder={t("onboardingFavorites.searchPlaceholder")}
									value={searchQuery}
									onChange={e => setSearchQuery(e.target.value)}
									className="pl-10 bg-card/50 border-border/50"
								/>
							</div>
						</div>

						<div className="flex flex-wrap justify-center gap-2">
							{Object.entries(mediaKinds).map(([key, kind]) => {
								const Icon = kind.icon;
								const isActive = activeCategory === key;
								return (
									<Button
										key={key}
										variant={isActive ? "default" : "outline"}
										size="sm"
										onClick={() => setActiveCategory(key as MediaKindKey)}
										className={cn(
											"rounded-full",
											isActive ? "bg-primary text-primary-foreground" : "bg-card/50 hover:bg-card"
										)}
									>
										<Icon className="w-4 h-4 mr-2" />
										{t(`onboardingFavorites.category.${key}`)}
									</Button>
								);
							})}
						</div>
					</div>
				</div>
			</header>

			<main className="flex-1 overflow-y-auto">
				<div className="mx-auto w-full max-w-6xl px-6 py-6">
					<div className="space-y-6 pb-28">
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
							<AnimatePresence>
								{displayedNodes?.map(media => {
									return (
										<motion.div
											key={media.id}
											className="p-4 transition-all relative group rounded border"
											initial={{ opacity: 0, scale: 0.9 }}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.9 }}
											transition={{ duration: 0.2 }}
										>
											<div className="flex gap-3 mb-3 items-start">
												<div>
													<MediaPosterAsPicture
														loading="lazy"
														title={media.title}
														className="w-12 rounded"
														posterId={media.poster?.match(/\/([^/.]+)\./)?.[1]}
													/>
												</div>
												<div className="flex-1">
													<h3 className="font-semibold text-sm line-clamp-1">{media.title}</h3>
													<p className="text-xs text-muted-foreground">
														{t(`media.${media.kind === "MOVIE" ? "movie" : "tv-show"}`)} •{" "}
														{media.year}
													</p>
												</div>
											</div>
											<div className="flex gap-2">
												<Button
													onClick={() => handleReaction(media.id, "LIKE")}
													size="sm"
													variant="outline"
													className="flex-1"
												>
													<ThumbsUp className="w-3 h-3 mr-1" />
													{t("onboardingFavorites.like")}
												</Button>
												<Button
													onClick={() => handleReaction(media.id, "DISLIKE")}
													size="sm"
													variant="outline"
													className="flex-1"
												>
													<ThumbsDown className="w-3 h-3 mr-1" />
													{t("onboardingFavorites.dislike")}
												</Button>
											</div>
										</motion.div>
									);
								})}
							</AnimatePresence>
						</div>
					</div>
				</div>
			</main>

			<footer className="sticky bottom-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
				<div className="mx-auto w-full max-w-6xl px-6 py-4">
					<div className="flex  flex-col items-end gap-3">
						<Link
							to="/onboarding/tos"
							className={cn(
								"flex items-center",
								buttonVariants({
									variant: "default",
								})
							)}
						>
							<span>
								{reactedIds.size > 0
									? t("onboardingFavorites.continue")
									: t("onboardingFavorites.skip")}
							</span>
							{direction === "rtl" ? (
								<ArrowLeft className="size-4" />
							) : (
								<ArrowRight className="size-4" />
							)}
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
