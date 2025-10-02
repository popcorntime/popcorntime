import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect, useRef } from "react";
import { useGlobalStore } from "@/stores/global";

export function MetricsProvider({ children }: React.PropsWithChildren) {
	const enableAnalytics = useGlobalStore(s => s.settings.enableAnalytics);
	const initializedRef = useRef(false);

	useEffect(() => {
		if (initializedRef.current) return;

		posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
			api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
			capture_pageview: true,
			persistence: "localStorage",
			opt_out_capturing_by_default: true,
			disable_session_recording: true,
			loaded: ph => {
				if (enableAnalytics) {
					ph.opt_in_capturing();
				}
			},
		});

		initializedRef.current = true;
	}, [enableAnalytics]);

	useEffect(() => {
		if (enableAnalytics) {
			posthog.opt_in_capturing();
		} else {
			posthog.opt_out_capturing();
			posthog.reset();
		}
	}, [enableAnalytics]);

	return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
