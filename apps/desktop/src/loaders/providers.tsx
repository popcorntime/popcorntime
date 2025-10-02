import { useEffect } from "react";
import { useCountry } from "@/hooks/useCountry";
import { useTauri } from "@/hooks/useTauri";
import { useGlobalStore } from "@/stores/global";

export function ProvidersLoaderMount() {
	const isActive = useGlobalStore(s => s.session.isActive);
	const preferencesStatus = useGlobalStore(s => s.preferences.status);
	const { country } = useCountry();
	const { api } = useTauri();

	useEffect(() => {
		// we want to wait for preferences to be loaded to get the prefered country
		if (!isActive || !country || preferencesStatus !== "ready") {
			return;
		}

		const { providersRequested, providersFailed, providersSucceeded } = useGlobalStore.getState();
		providersRequested();

		api
			.providers({ country })
			.then(res => res?.providers ?? [])
			.then(providersSucceeded)
			.catch(providersFailed);
	}, [isActive, country, api.providers, preferencesStatus]);

	return null;
}
