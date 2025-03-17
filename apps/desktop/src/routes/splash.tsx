import { i18n } from "@popcorntime/i18n/types";
import { Navigate } from "react-router";
import { SplashScreen } from "@/components/splash-screen";
import { useGlobalStore } from "@/stores/global";

export function SplashRoute() {
	const isActive = useGlobalStore(s => s.session.isActive);
	const onboarded = useGlobalStore(s => s.settings.onboarded);
	const appInitialized = useGlobalStore(s => s.app.initialized);
	const bootInitialized = useGlobalStore(s => s.app.bootInitialized);
	const country = useGlobalStore(s => s.preferences.country);

	if (!bootInitialized) return <SplashScreen />;
	if (!onboarded) return <Navigate to="/onboarding" replace />;

	if (isActive) {
		if (!appInitialized) return <SplashScreen />;
		const goto = (country ?? i18n.defaultCountry).toLowerCase();
		return <Navigate to={`/browse/${goto}`} replace />;
	}

	return <Navigate to="/login" replace />;
}
