import { Badge } from "@popcorntime/ui/components/badge";
import { Button } from "@popcorntime/ui/components/button";
import { Input } from "@popcorntime/ui/components/input";
import { Spinner } from "@popcorntime/ui/components/spinner";
import { cn } from "@popcorntime/ui/lib/utils";
import { ArrowLeft, ArrowRight, Check, Gift, Search, TrendingUp, Tv } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useProviders } from "@/hooks/useProviders";
import { useGlobalStore } from "@/stores/global";
import type { WatchPriceType } from "@/tauri/types";
import { ProviderIcon } from "../provider";

type ProviderCategory = "popular" | "free" | "flatrate" | "all";
type ProviderFilter =
	| WatchPriceType[]
	| {
			sortBy: "weight";
			number: number;
	  }
	| null;
interface ProviderCategoryInfo {
	key: string;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	filter: ProviderFilter;
	exclude?: WatchPriceType[];
}
export const providerCategories: Record<ProviderCategory, ProviderCategoryInfo> = {
	popular: { key: "popular", icon: TrendingUp, filter: { sortBy: "weight", number: 20 } },
	free: { key: "free", icon: Gift, filter: ["FREE"], exclude: ["FLATRATE"] },
	flatrate: { key: "subscription", icon: Tv, filter: ["FLATRATE"], exclude: ["FREE"] },
	all: { key: "all", icon: Search, filter: null },
};

export function OnboardingProviders() {
	const providers = useGlobalStore(state => state.providers.providers);
	const direction = useGlobalStore(state => state.i18n.direction);
	const country = useGlobalStore(state => state.preferences.country);
	const { setFavoritesMultipleProviders } = useProviders();
	const providersStatus = useGlobalStore(state => state.providers.status);
	const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [activeCategory, setActiveCategory] = useState<ProviderCategory>("popular");
	const { t } = useTranslation();
	const navigate = useNavigate();

	const filteredProviders = useMemo(() => {
		const categoryInfo = providerCategories[activeCategory];

		let providersByCategory = providers;
		const filter = categoryInfo.filter;
		const exclude = categoryInfo.exclude;

		if (filter) {
			if (Array.isArray(filter) && filter.length > 0) {
				providersByCategory = providers.filter(provider =>
					provider.priceTypes.some(type => filter.includes(type))
				);
			}

			if (filter && "sortBy" in filter && filter.sortBy === "weight" && filter.number > 0) {
				providersByCategory = [...providers]
					.sort((a, b) => (b.weight || 0) - (a.weight || 0))
					.slice(0, filter.number);
			}
		}

		if (exclude && exclude.length > 0) {
			providersByCategory = providersByCategory.filter(
				provider => !provider.priceTypes.some(type => exclude.includes(type))
			);
		}

		if (!searchQuery) return providersByCategory;

		return providersByCategory.filter(provider =>
			provider.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
		);
	}, [activeCategory, searchQuery, providers]);

	const toggleProvider = (providerId: string) => {
		setSelectedProviders(prev =>
			prev.includes(providerId) ? prev.filter(id => id !== providerId) : [...prev, providerId]
		);
	};

	const handleReset = () => setSelectedProviders([]);
	const handleChangeCountry = () => navigate("/onboarding/preferences");

	const handleContinue = useCallback(() => {
		if (!country) {
			throw new Error("Country must be set before setting providers");
		}
		if (selectedProviders.length === 0) {
			navigate("/browse");
		} else {
			setIsLoading(true);
			setFavoritesMultipleProviders(selectedProviders).finally(() => {
				setIsLoading(false);
				navigate("/browse");
			});
		}
	}, [selectedProviders, navigate, setFavoritesMultipleProviders, country, setIsLoading]);

	return (
		<div className="h-screen max-h-screen flex flex-col">
			<header className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
				<div className="mx-auto w-full max-w-6xl px-6 py-6 mt-10">
					<div className="text-center space-y-3">
						<div className="hidden lg:flex w-14 h-14 mx-auto bg-primary/20 rounded-full  items-center justify-center">
							<Tv className="w-7 h-7 text-primary" />
						</div>
						<h2 className="text-3xl font-bold text-foreground">{t("onboardingProviders.title")}</h2>
						<p className="text-muted-foreground text-pretty max-w-2xl mx-auto">
							{t("onboardingProviders.description")}
						</p>

						<div className="mt-4 grid gap-3 lg:gap-6">
							<div className="relative max-w-md mx-auto w-full">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
								<Input
									placeholder={t("onboardingProviders.searchPlaceholder")}
									value={searchQuery}
									onChange={e => setSearchQuery(e.target.value)}
									className="pl-10 bg-card/50 border-border/50"
								/>
							</div>

							<div className="flex flex-wrap justify-center gap-2">
								{Object.entries(providerCategories).map(([key, category]) => {
									const Icon = category.icon;
									const isActive = activeCategory === key;
									return (
										<Button
											key={key}
											variant={isActive ? "default" : "outline"}
											size="sm"
											onClick={() => setActiveCategory(key as ProviderCategory)}
											className={cn(
												"rounded-full",
												isActive ? "bg-primary text-primary-foreground" : "bg-card/50 hover:bg-card"
											)}
										>
											<Icon className="w-4 h-4 mr-2" />
											{t(`onboardingProviders.category.${category.key}`)}
										</Button>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</header>

			<main className="flex-1 overflow-y-auto">
				<div className="mx-auto w-full max-w-6xl px-6 py-6">
					<div className="space-y-6 pb-28">
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
							{providersStatus === "loading" && !isLoading && (
								<div className="col-span-full flex items-center justify-center py-12">
									<Spinner className="w-8 h-8 text-primary" />
								</div>
							)}

							{filteredProviders.map(provider => {
								const isSelected = selectedProviders.includes(provider.key);
								return (
									<button
										type="button"
										key={provider.key}
										className={cn(
											"p-4 cursor-pointer transition-all relative group rounded border",
											isSelected
												? "bg-primary/10 border-primary/50 ring-1 ring-primary/30"
												: "bg-card/80 hover:bg-card border-card hover:border-border"
										)}
										onClick={() => toggleProvider(provider.key)}
									>
										<div className="text-center space-y-2">
											<div className="size-10 mx-auto">
												<ProviderIcon
													className="rounded group-hover:scale-105 transition-transform"
													icon={provider.logo}
												/>
											</div>
											<h3 className="font-medium text-sm leading-tight line-clamp-1">
												{provider.name}
											</h3>
										</div>
										{isSelected && (
											<div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
												<Check className="w-3 h-3 text-primary-foreground" />
											</div>
										)}
									</button>
								);
							})}
						</div>

						{filteredProviders.length === 0 && searchQuery && (
							<div className="text-center py-12">
								<Search className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
								<p className="text-muted-foreground">
									{t("onboardingProviders.noFound", { query: searchQuery })}
								</p>
								<Button variant="ghost" onClick={() => setSearchQuery("")} className="mt-2">
									{t("onboardingProviders.clearSearch")}
								</Button>
							</div>
						)}
					</div>
				</div>
			</main>
			<footer className="sticky bottom-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
				<div className="mx-auto w-full max-w-6xl px-6 py-4">
					<div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
						<div className="flex items-center gap-2">
							<Badge
								variant={selectedProviders.length > 0 ? "default" : "secondary"}
								className="px-3 py-1"
							>
								{t("onboardingProviders.selected", { count: selectedProviders.length })}
							</Badge>
							{selectedProviders.length > 0 && (
								<Button
									variant="ghost"
									size="sm"
									onClick={handleReset}
									className="text-xs text-muted-foreground hover:text-foreground"
								>
									{t("onboardingProviders.clearAll")}
								</Button>
							)}
						</div>

						<div className="flex gap-2">
							<Button variant="link" onClick={handleChangeCountry}>
								{t("onboardingProviders.selectCountry")}
							</Button>
							<Button disabled={isLoading} onClick={handleContinue} className="flex items-center">
								<span>
									{selectedProviders.length > 0
										? t("onboardingProviders.continue")
										: t("onboardingProviders.skip")}
								</span>
								{isLoading ? (
									<Spinner className="size-4 text-primary-foreground" />
								) : direction === "rtl" ? (
									<ArrowLeft className="size-4" />
								) : (
									<ArrowRight className="size-4" />
								)}
							</Button>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
