import { HashRouter, Route, Routes } from "react-router";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { initReactI18n } from "@/i18n";
import { BrowseLayout, DefaultLayout } from "@/layout";
import { PreferencesLoaderMount } from "@/loaders/preferences";
import { ProvidersLoaderMount } from "@/loaders/providers";
import { SessionLoaderMount } from "@/loaders/session";
import { SettingsLoaderMount } from "@/loaders/settings";
import { Providers } from "@/providers";
import { BrowseRoute } from "@/routes/browse";
import { LoginRoute } from "@/routes/login";
import { MaintenanceRoute } from "@/routes/maintenance";
import { NotFoundRoute } from "@/routes/not-found";
import {
	OnboardingManifestRoute,
	OnboardingPreferencesRoute,
	OnboardingProvidersRoute,
	OnboardingTimelineRoute,
	OnboardingWelcomeRoute,
} from "@/routes/onboarding";
import { RequireSession } from "@/routes/require-session";
import { SplashRoute } from "@/routes/splash";

import "@/css/styles.css";
import "@popcorntime/ui/styles.css";
import "flag-icons/css/flag-icons.min.css";

initReactI18n();

function Loaders() {
	return (
		<>
			<SettingsLoaderMount />
			<SessionLoaderMount />
			<PreferencesLoaderMount />
			<ProvidersLoaderMount />
		</>
	);
}

export function App() {
	useErrorHandler();

	return (
		<HashRouter>
			<Providers>
				<Loaders />
				<Routes>
					<Route element={<DefaultLayout />}>
						<Route index element={<SplashRoute />} />
						<Route path="/onboarding">
							<Route index element={<OnboardingWelcomeRoute />} />
							<Route path="manifest" element={<OnboardingManifestRoute />} />
							<Route path="timeline" element={<OnboardingTimelineRoute />} />
							<Route element={<RequireSession />}>
								<Route path="providers" element={<OnboardingProvidersRoute />} />
								<Route path="preferences" element={<OnboardingPreferencesRoute />} />
							</Route>
						</Route>
						<Route path="/login" element={<LoginRoute />} />
						<Route path="/maintenance" element={<MaintenanceRoute />} />
						<Route path="*" element={<NotFoundRoute />} />
					</Route>

					<Route element={<RequireSession />}>
						<Route path="/browse" element={<BrowseLayout />}>
							<Route index element={<BrowseRoute />} />
						</Route>
					</Route>
				</Routes>
			</Providers>
		</HashRouter>
	);
}
