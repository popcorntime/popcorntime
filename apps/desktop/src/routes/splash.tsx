import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/shallow";
import { SplashScreen } from "@/components/splash-screen";
import { useGlobalStore } from "@/stores/global";

export function SplashRoute() {
	const appBoot = useGlobalStore(s => s.app.boot);
	const onboarded = useGlobalStore(s => s.settings.onboardingComplete);
	const { isActive, status: sessionStatus } = useGlobalStore(useShallow(s => s.session));
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
			// make sure session is fully loaded
			if (!initialRedirectAttempted.current && sessionStatus === "ready") {
				initialRedirectAttempted.current = true;
				navigate("/login", { flushSync: true });
			}
		}
	}, [appBoot, onboarded, isActive, navigate, preferredCountry, sessionStatus]);

	return <SplashScreen />;
}
