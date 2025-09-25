import type { Country } from "@popcorntime/i18n/types";
import { useCallback } from "react";
import { useCountry } from "@/hooks/useCountry";
import { useTauri } from "@/hooks/useTauri";
import { useGlobalStore } from "@/stores/global";
import type { Provider } from "@/tauri/types";

export interface InvokeParams {
	country: Country;
	favorites: boolean;
}

export const useProviders = () => {
	const setInitialized = useGlobalStore(state => state.providers.setInitialized);
	const setIsLoading = useGlobalStore(state => state.providers.setIsLoading);
	const setProviders = useGlobalStore(state => state.providers.setProviders);
	const { country } = useCountry();
	const { api } = useTauri();

	const loadProviders = useCallback(
		async (country: Country): Promise<Provider[]> => {
			try {
				return api.providers({ country }).then(res => res?.providers ?? []);
			} catch (err) {
				console.error("failed to load providers", err);
				return [];
			}
		},
		[api.providers]
	);

	const getProviders = useCallback(
		async (country: Country) => {
			setIsLoading(true);
			try {
				const providers = await loadProviders(country);
				setProviders(providers);
			} catch (error) {
				console.error("failed to load providers", error);
			} finally {
				setInitialized();
				setIsLoading(false);
			}
		},
		[setIsLoading, setProviders, loadProviders, setInitialized]
	);

	const setFavorites = useCallback(
		async (providerKey: string, favorite: boolean) => {
			setIsLoading(true);
			await api.setFavoritesProvider({ country, providerKey, favorite });

			setIsLoading(false);

			// re-sync providers (would be better with a diff)
			const providers = await loadProviders(country);
			setProviders(providers);
		},
		[country, api.setFavoritesProvider, setProviders, setIsLoading, loadProviders]
	);

	const addToFavorites = useCallback(
		async (providerKey: string) => {
			setFavorites(providerKey, true);
		},
		[setFavorites]
	);

	const removeFromFavorites = useCallback(
		async (providerKey: string) => {
			setFavorites(providerKey, false);
		},
		[setFavorites]
	);

	return {
		getProviders,
		addToFavorites,
		removeFromFavorites,
	};
};
