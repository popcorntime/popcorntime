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
	const { country } = useCountry();
	const providers = useGlobalStore(s => s.providers.providers);
	const { api } = useTauri();

	const setFavorites = useCallback(
		async (providerKey: string, favorite: boolean) => {
			await api.setFavoritesProvider({ country, providerKey, favorite });

			// optimistic update
			const updatedProviders = providers.map(p => {
				if (p.key === providerKey) {
					return { ...p, favorite };
				}
				return p;
			});

			const { providersSucceeded } = useGlobalStore.getState();
			providersSucceeded(updatedProviders);
		},
		[country, api.setFavoritesProvider, providers]
	);

	const setFavoritesMultipleProviders = useCallback(
		async (providersKey: string[]) => {
			await api.setFavoritesMultipleProviders({ country, providersKey });

			// optimistic update
			const updatedProviders = providers.map(p => {
				if (providersKey.includes(p.key)) {
					return { ...p, favorite: true };
				}
				return p;
			});

			const { providersSucceeded } = useGlobalStore.getState();
			providersSucceeded(updatedProviders);
		},
		[country, api.setFavoritesProvider, providers]
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
		addToFavorites,
		removeFromFavorites,
		setFavoritesMultipleProviders,
	};
};
