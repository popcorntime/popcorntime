import { OnboardingManifest } from "@/components/onboarding/manifest";
import { OnboardingPreferences } from "@/components/onboarding/preferences";
import { OnboardingProviders } from "@/components/onboarding/providers";
import { OnboardingTimeline } from "@/components/onboarding/timeline";
import { OnboardingWelcome } from "@/components/onboarding/welcome";
import { OnboardingTOS } from "@/components/onboarding/tos";

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

export function OnboardingTOSRoute() {
	return <OnboardingTOS />;
}
