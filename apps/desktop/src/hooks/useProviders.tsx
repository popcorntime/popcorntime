import type { ProviderSearchForCountry } from "@popcorntime/graphql/types";
import type { Country } from "@popcorntime/i18n/types";
import { useCallback } from "react";
import { useCountry } from "@/hooks/useCountry";
import { useTauri } from "@/hooks/useTauri";
import { useGlobalStore } from "@/stores/global";

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
	const { invoke } = useTauri();

	const loadProviders = useCallback(
		async (favorites: boolean, country: Country): Promise<ProviderSearchForCountry[]> => {
			try {
				return invoke<ProviderSearchForCountry[]>(
					"providers",
					{
						params: { country: country, favorites },
					},
					{
						hideToast: true,
					}
				);
			} catch (err) {
				console.error("failed to load providers", err);
				return [];
			}
		},
		[invoke]
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
			await invoke<boolean>("add_favorites_provider", {
				params: { country: country.toUpperCase(), providerKey },
			});
			setIsLoading(false);
			// update favs
			const favs = await loadProviders(true, country.toUpperCase() as Country);
			setFavoriteProviders(favs);
		},
		[country, loadProviders, invoke, setFavoriteProviders, setIsLoading]
	);

	const removeFromFavorites = useCallback(
		async (providerKey: string) => {
			setIsLoading(true);
			await invoke<boolean>("remove_favorites_provider", {
				params: { country: country.toUpperCase(), providerKey },
			});
			setIsLoading(false);
			// update favs
			const favs = await loadProviders(true, country.toUpperCase() as Country);
			setFavoriteProviders(favs);
		},
		[country, loadProviders, invoke, setFavoriteProviders, setIsLoading]
	);

	return {
		getProviders,
		addToFavorites,
		removeFromFavorites,
	};
};
