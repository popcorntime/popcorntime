import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";
import { useGlobalStore } from "@/stores/global";

export function MetricsProvider({ children }: React.PropsWithChildren) {
	const allowAnalytics = useGlobalStore(s => s.settings.allowAnalytics);
	const key = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
	const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

	useEffect(() => {
		posthog.init(key, {
			api_host: host,
			capture_pageview: true,
			persistence: "localStorage",
			opt_out_capturing_by_default: true,
			disable_session_recording: true,
			loaded: ph => {
				if (allowAnalytics) ph.opt_in_capturing();
			},
		});
	}, [key, host]);

	useEffect(() => {
		if (allowAnalytics) posthog.opt_in_capturing();
		else {
			posthog.opt_out_capturing();
			posthog.reset();
		}
	}, [allowAnalytics]);

	return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
