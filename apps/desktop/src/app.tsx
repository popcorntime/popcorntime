import { HashRouter, Navigate, Route, Routes } from "react-router";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { initReactI18n } from "@/i18n";
import { BrowseLayout, DefaultLayout } from "@/layout";
import { Providers } from "@/providers";
import { BrowseRoute } from "@/routes/browse";
import { LoginRoute } from "@/routes/login";
import { MaintenanceRoute } from "@/routes/maintenance";
import { NotFoundRoute } from "@/routes/not-found";
import {
	OnboardingManifestRoute,
	OnboardingTimelineRoute,
	OnboardingWelcomeRoute,
} from "@/routes/onboarding";
import { SplashRoute } from "@/routes/splash";

import "@/css/styles.css";
import "@popcorntime/ui/styles.css";
import "flag-icons/css/flag-icons.min.css";

initReactI18n();

export function App() {
	useErrorHandler();

	return (
		<HashRouter>
			<Providers>
				<Routes>
					<Route element={<DefaultLayout />}>
						<Route index element={<SplashRoute />} />
						<Route path="/onboarding">
							<Route index element={<OnboardingWelcomeRoute />} />
							<Route path="/onboarding/manifest" element={<OnboardingManifestRoute />} />
							<Route path="/onboarding/timeline" element={<OnboardingTimelineRoute />} />
						</Route>
						<Route path="/login" element={<LoginRoute />} />
						<Route path="/maintenance" element={<MaintenanceRoute />} />
						<Route path="*" element={<NotFoundRoute />} />
					</Route>
					<Route path="/browse/:country/:kind" element={<BrowseLayout />}>
						<Route index element={<BrowseRoute />} />
					</Route>
					<Route path="/browse/:country" element={<Navigate to="movie" replace />} />
				</Routes>
			</Providers>
		</HashRouter>
	);
}
