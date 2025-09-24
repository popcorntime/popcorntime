import type { Country } from "@popcorntime/i18n/types";
import { useCallback } from "react";
import { useCountry } from "@/hooks/useCountry";
import { useTauri } from "@/hooks/useTauri";
import { useGlobalStore } from "@/stores/global";
import type { ProviderSearchForCountry } from "@/tauri/types";

export interface InvokeParams {
	country: Country;
	favorites: boolean;
}

export const useProviders = () => {
	const setInitialized = useGlobalStore(state => state.providers.setInitialized);
	const setIsLoading = useGlobalStore(state => state.providers.setIsLoading);
	const setProviders = useGlobalStore(state => state.providers.setProviders);
	const setFavoriteProviders = useGlobalStore(state => state.providers.setFavorites);
	const { country } = useCountry();
	const { api } = useTauri();

	const loadProviders = useCallback(
		async (favorites: boolean, country: Country): Promise<ProviderSearchForCountry[]> => {
			try {
				return api.providers({ country, favorites }).then(res => res?.providers ?? []);
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
				const [fav, all] = await Promise.all([
					loadProviders(true, country),
					loadProviders(false, country),
				]);
				setFavoriteProviders(fav);
				setProviders(all);
			} catch (error) {
				console.error("failed to load providers", error);
			} finally {
				setInitialized();
				setIsLoading(false);
			}
		},
		[setIsLoading, setFavoriteProviders, setProviders, loadProviders, setInitialized]
	);

	const addToFavorites = useCallback(
		async (providerKey: string) => {
			setIsLoading(true);
			await api.addFavoritesProvider({ country, providerKey });

			setIsLoading(false);
			// update favs
			const favs = await loadProviders(true, country.toUpperCase() as Country);
			setFavoriteProviders(favs);
		},
		[country, loadProviders, api.addFavoritesProvider, setFavoriteProviders, setIsLoading]
	);

	const removeFromFavorites = useCallback(
		async (providerKey: string) => {
			setIsLoading(true);
			await api.removeFavoritesProvider({ country, providerKey });

			setIsLoading(false);
			// update favs
			const favs = await loadProviders(true, country.toUpperCase() as Country);
			setFavoriteProviders(favs);
		},
		[country, loadProviders, api.removeFavoritesProvider, setFavoriteProviders, setIsLoading]
	);

	return {
		getProviders,
		addToFavorites,
		removeFromFavorites,
	};
};
