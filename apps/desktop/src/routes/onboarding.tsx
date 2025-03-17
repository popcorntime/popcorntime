import { OnboardingManifest } from "@/components/onboarding/manifest";
import { OnboardingTimeline } from "@/components/onboarding/timeline";
import { OnboardingWelcome } from "@/components/onboarding/welcome";

export function OnboardingWelcomeRoute() {
	return <OnboardingWelcome />;
}

export function OnboardingTimelineRoute() {
	return <OnboardingTimeline />;
}

export function OnboardingManifestRoute() {
	return <OnboardingManifest />;
}
