import type { Country, Locale } from "@popcorntime/i18n/types";
import { useEffect } from "react";
import { useTauri } from "@/hooks/useTauri";
import { useGlobalStore } from "@/stores/global";

export function PreferencesLoaderMount() {
	const { api } = useTauri();
	const isActive = useGlobalStore(s => s.session.isActive);

	useEffect(() => {
		if (!isActive) {
			return;
		}

		const { preferencesFailed, preferencesRequested, preferencesSucceeded } =
			useGlobalStore.getState();

		preferencesRequested();

		api
			.userPreferences()
			.then(prefs => {
				const country = prefs?.preferences?.country as Country | undefined;
				const language = prefs?.preferences?.language as Locale | undefined;
				preferencesSucceeded({ country, language });
			})
			.catch(preferencesFailed);
	}, [isActive, api.userPreferences]);

	return null;
}
