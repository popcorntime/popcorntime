import { Navigate, useNavigate } from "react-router";
import { SplashScreen } from "@/components/splash-screen";
import { useGlobalStore } from "@/stores/global";
import { useEffect, useRef } from "react";

export function SplashRoute() {
	const bootInitialized = useGlobalStore(s => s.app.bootInitialized);
	const appInitialized = useGlobalStore(s => s.app.initialized);
	const onboarded = useGlobalStore(s => s.settings.onboarded);
	const isActive = useGlobalStore(s => s.session.isActive);
	const initialRedirectAttempted = useRef(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (!bootInitialized) return;
		if (!onboarded) {
			if (!initialRedirectAttempted.current) {
				initialRedirectAttempted.current = true;
				navigate("/onboarding", { flushSync: true });
			}
		} else if (isActive) {
			if (!appInitialized) return;
			if (!initialRedirectAttempted.current) {
				initialRedirectAttempted.current = true;
				navigate("/browse", { flushSync: true });
			}
		} else {
			if (!initialRedirectAttempted.current) {
				initialRedirectAttempted.current = true;
				navigate("/login", { flushSync: true });
			}
		}
	}, [bootInitialized, onboarded, isActive, appInitialized, navigate]);

	return <SplashScreen />;
}
