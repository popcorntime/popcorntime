import { OnboardingManifest } from "@/components/onboarding/launch/manifest";
import { OnboardingTimeline } from "@/components/onboarding/launch/timeline";
import { OnboardingWelcome } from "@/components/onboarding/launch/welcome";
import { OnboardingFavorites } from "@/components/onboarding/user/favorites";
import { OnboardingPreferences } from "@/components/onboarding/user/preferences";
import { OnboardingProviders } from "@/components/onboarding/user/providers";
import { OnboardingTOS } from "@/components/onboarding/user/tos";

export function OnboardingWelcomeRoute() {
	return <OnboardingWelcome />;
}

export function OnboardingTimelineRoute() {
	return <OnboardingTimeline />;
}

export function OnboardingManifestRoute() {
	return <OnboardingManifest />;
}

export function OnboardingProvidersRoute() {
	return <OnboardingProviders />;
}

export function OnboardingPreferencesRoute() {
	return <OnboardingPreferences />;
}

export function OnboardingFavoritesRoute() {
	return <OnboardingFavorites />;
}

export function OnboardingTOSRoute() {
	return <OnboardingTOS />;
}
