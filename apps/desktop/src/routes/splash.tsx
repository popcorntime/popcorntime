import { i18n } from "@popcorntime/i18n/types";
import { Navigate } from "react-router";
import { SplashScreen } from "@/components/splash-screen";
import { useGlobalStore } from "@/stores/global";

export function SplashRoute() {
	const isActive = useGlobalStore(s => s.session.isActive);
	const onboarded = useGlobalStore(s => s.settings.onboarded);
	const appBoot = useGlobalStore(s => s.app.boot);
	const country = useGlobalStore(s => s.preferences.country);

	if (appBoot === "cold") return <SplashScreen />;
	if (!onboarded) return <Navigate to="/onboarding" replace />;

	if (isActive) {
		if (appBoot !== "booted") return <SplashScreen />;
		const goto = (country ?? i18n.defaultCountry).toLowerCase();
		return <Navigate to={`/browse/${goto}`} replace />;
	}

	return <Navigate to="/login" replace />;
}
