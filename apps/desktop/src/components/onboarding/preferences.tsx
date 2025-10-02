import { type Country, i18n, isDefaultLocale, type Locale } from "@popcorntime/i18n";
import { Button } from "@popcorntime/ui/components/button";
import { Spinner } from "@popcorntime/ui/components/spinner";
import { cn } from "@popcorntime/ui/lib/utils";
import { ChevronLeft, ChevronRight, ExternalLink, Globe, MapPin } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { useTauri } from "@/hooks/useTauri";
import { useGlobalStore } from "@/stores/global";

export function OnboardingPreferences() {
	const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
	const preferencesSucceeded = useGlobalStore(state => state.preferencesSucceeded);
	const direction = useGlobalStore(state => state.i18n.direction);
	const [selectedLocale, setSelectedLocale] = useState<Locale | null>(null);
	const [showAllLocales, setShowAllLocales] = useState(false);
	const { api } = useTauri();
	const [currentStep, setCurrentStep] = useState<"country" | "language">("country");
	const { t } = useTranslation();
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleCountrySelect = (countryCode: Country) => {
		setSelectedCountry(countryCode);
		setCurrentStep("language");
	};

	const handleLanguageSelect = useCallback(
		(langCode: Locale) => {
			if (!selectedCountry) return;
			setSelectedLocale(langCode);
			setIsLoading(true);
			api.updateUserPreferences({ country: selectedCountry, language: langCode }).then(() => {
				setIsLoading(false);
				preferencesSucceeded({ country: selectedCountry, language: langCode });
				navigate("/onboarding/providers");
			});
		},
		[selectedCountry, api, navigate, preferencesSucceeded]
	);

	const handleBackToCountry = () => {
		setShowAllLocales(false);
		setCurrentStep("country");
	};

	const availableLanguages = useMemo(() => {
		if (!selectedCountry) return [];
		if (showAllLocales) return i18n.locales;
		// make sure we always have "en" as a fallback option
		return [...new Set([...i18n.raw[selectedCountry].languages, "en" as Locale])].sort((a, b) => {
			const isDefaultA = isDefaultLocale(selectedCountry, a);
			const isDefaultB = isDefaultLocale(selectedCountry, b);
			if (isDefaultA && !isDefaultB) return -1;
			if (!isDefaultA && isDefaultB) return 1;
			const localeA = t(`language.${a.toLowerCase()}`);
			const localeB = t(`language.${b.toLowerCase()}`);
			return localeA.localeCompare(localeB);
		});
	}, [selectedCountry, showAllLocales, t]);

	const sortedCountries = useMemo(() => {
		return [...i18n.countries].sort((a, b) => {
			const countryA = t(`country.${a.toLowerCase()}`);
			const countryB = t(`country.${b.toLowerCase()}`);
			return countryA.localeCompare(countryB);
		});
	}, [t]);

	const steps = useMemo(() => {
		return {
			country: {
				title: t("onboardingPreferences.countryTitle"),
				description: t("onboardingPreferences.countryDescription"),
				icon: <MapPin className="text-primary h-8 w-8" />,
				content: (
					<div className="grid grid-cols-1 gap-3 overflow-y-auto">
						{sortedCountries.map(countryCode => (
							<button
								type="button"
								key={countryCode}
								className="bg-card hover:bg-card/80 cursor-pointer rounded-md p-4 transition-all"
								onClick={() => handleCountrySelect(countryCode)}
							>
								<div className="flex items-center gap-3">
									<span
										className={cn("fi fis size-4 rounded", `fi-${countryCode.toLowerCase()}`)}
									></span>
									<span className="font-medium">{t(`country.${countryCode.toLowerCase()}`)}</span>
								</div>
							</button>
						))}
						<div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
							<div className="text-3xl font-extrabold tracking-tight uppercase text-balance text-muted-foreground/60">
								Your Country is missing?
							</div>
							<div>
								Please{" "}
								<Link
									className="underline hover:text-foreground space-x-1"
									to="https://github.com/popcorntime/popcorntime/issues/new?template=3_country.yaml"
									target="_blank"
								>
									<span>open an issue on GitHub</span>
									<ExternalLink className="inline-block size-2" />
								</Link>{" "}
								to request its addition.
							</div>
						</div>
					</div>
				),
			},
			language: {
				title: t("onboardingPreferences.languageTitle"),
				description: t("onboardingPreferences.languageDescription", {
					inCountry: t(`inCountry.${selectedCountry?.toLowerCase()}`),
				}),
				icon: <Globe className="text-primary h-8 w-8" />,
				content: (
					<>
						<div className="flex justify-between">
							<Button
								variant="ghost"
								onClick={handleBackToCountry}
								className="text-muted-foreground hover:text-foreground mb-4"
							>
								{direction === "rtl" ? (
									<ChevronRight className="mr-1 h-4 w-4" />
								) : (
									<ChevronLeft className="mr-1 h-4 w-4" />
								)}
								{t("onboardingPreferences.changeCountry")}
							</Button>
							{!showAllLocales && (
								<Button
									variant="ghost"
									onClick={() => setShowAllLocales(true)}
									className="text-muted-foreground hover:text-foreground mb-4"
								>
									{t("onboardingPreferences.showAll")}
								</Button>
							)}
						</div>

						<div className="grid grid-cols-1 gap-3">
							{availableLanguages.map(langCode => (
								<button
									type="button"
									key={langCode}
									className="bg-card hover:bg-card/80 cursor-pointer rounded-md p-4 transition-all"
									onClick={() => handleLanguageSelect(langCode)}
								>
									<div className="flex justify-between gap-3 text-left rtl:text-right">
										<div className="flex flex-col">
											<span className="font-medium">{t(`language.${langCode}`)}</span>
											{selectedCountry && isDefaultLocale(selectedCountry, langCode) && (
												<span className="text-primary text-xs">
													{t("onboardingPreferences.default")}
												</span>
											)}
										</div>
										{selectedLocale === langCode && isLoading && <Spinner className={cn()} />}
									</div>
								</button>
							))}
						</div>
					</>
				),
			},
		};
	}, [
		t,
		sortedCountries,
		availableLanguages,
		selectedCountry,
		selectedLocale,
		isLoading,
		direction,
	]);

	return (
		<div className="h-screen max-h-screen flex flex-col">
			<header className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
				<div className="mx-auto w-full max-w-6xl px-6 py-6 mt-10">
					<div className="text-center space-y-3">
						<div className="hidden lg:flex w-14 h-14 mx-auto bg-primary/20 rounded-full  items-center justify-center">
							{steps[currentStep].icon}
						</div>
						<h2 className="text-3xl font-bold text-foreground">{steps[currentStep].title}</h2>
						<p className="text-muted-foreground text-pretty max-w-2xl mx-auto">
							{steps[currentStep].description}
						</p>
					</div>
				</div>
			</header>

			<main className="flex-1 overflow-y-auto">
				<div className="mx-auto w-full max-w-xl xl:max-w-4xl px-6 py-6">
					<div className="space-y-6">{steps[currentStep].content}</div>
				</div>
			</main>
		</div>
	);
}
