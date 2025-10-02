import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { SplashScreen } from "@/components/splash-screen";
import { useGlobalStore } from "@/stores/global";

export function SplashRoute() {
	const appBoot = useGlobalStore(s => s.app.boot);
	const onboarded = useGlobalStore(s => s.settings.onboardingComplete);
	const isActive = useGlobalStore(s => s.session.isActive);
	const preferredCountry = useGlobalStore(s => s.preferences.country);
	const initialRedirectAttempted = useRef(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (appBoot === "cold") return;
		if (!onboarded) {
			if (!initialRedirectAttempted.current) {
				initialRedirectAttempted.current = true;
				navigate("/onboarding", { flushSync: true });
			}
		} else if (isActive) {
			if (appBoot !== "booted") return;
			if (!initialRedirectAttempted.current) {
				initialRedirectAttempted.current = true;
				if (!preferredCountry) {
					navigate("/onboarding/preferences", { flushSync: true });
				} else {
					navigate("/browse", { flushSync: true });
				}
			}
		} else {
			if (!initialRedirectAttempted.current) {
				initialRedirectAttempted.current = true;
				navigate("/login", { flushSync: true });
			}
		}
	}, [appBoot, onboarded, isActive, navigate, preferredCountry]);

	return <SplashScreen />;
}
