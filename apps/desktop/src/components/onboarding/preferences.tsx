import { type Country, i18n, isDefaultLocale, type Locale } from "@popcorntime/i18n";
import { Button } from "@popcorntime/ui/components/button";
import { Spinner } from "@popcorntime/ui/components/spinner";
import { cn } from "@popcorntime/ui/lib/utils";
import { ChevronLeft, Globe, MapPin } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useTauri } from "@/hooks/useTauri";
import { useGlobalStore } from "@/stores/global";

export function OnboardingPreferences() {
	const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
	const setPreferences = useGlobalStore(state => state.preferences.setPreferences);
	const [selectedLocale, setSelectedLocale] = useState<Locale | null>(null);
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
				setPreferences({ country: selectedCountry, language: langCode });
				navigate("/onboarding/providers");
			});
		},
		[selectedCountry, api, navigate, setPreferences]
	);

	const handleBackToCountry = () => {
		setCurrentStep("country");
	};

	const availableLanguages = useMemo(() => {
		if (!selectedCountry) return [];
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
	}, [selectedCountry]);

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
					<div className="grid max-h-96 grid-cols-1 gap-3 overflow-y-auto">
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
						<Button
							variant="ghost"
							onClick={handleBackToCountry}
							className="text-muted-foreground hover:text-foreground mb-4"
						>
							<ChevronLeft className="mr-1 h-4 w-4" />
							{t("onboardingPreferences.changeCountry")}
						</Button>

						<div className="grid grid-cols-1 gap-3">
							{availableLanguages.map(langCode => (
								<button
									type="button"
									key={langCode}
									className="bg-card hover:bg-card/80 cursor-pointer rounded-md p-4 transition-all"
									onClick={() => handleLanguageSelect(langCode)}
								>
									<div className="flex justify-between gap-3">
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
	}, [t, sortedCountries, availableLanguages, selectedCountry, selectedLocale, isLoading]);

	return (
		<div className="flex min-h-screen items-center justify-center p-6">
			<div className="w-full max-w-6xl space-y-8">
				<div className="space-y-4 text-center">
					<div className="bg-primary/20 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
						{steps[currentStep].icon}
					</div>

					<h2 className="text-foreground text-3xl font-bold">{steps[currentStep].title}</h2>
					<p className="text-muted-foreground text-pretty">{steps[currentStep].description}</p>
				</div>

				<div className="space-y-4">{steps[currentStep].content}</div>
			</div>
		</div>
	);
}
