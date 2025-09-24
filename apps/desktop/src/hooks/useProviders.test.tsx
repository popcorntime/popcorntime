import type { Country } from "@popcorntime/i18n/types";
import { clearMocks, mockIPC } from "@tauri-apps/api/mocks";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { CountryProvider } from "@/hooks/useCountry";
import { useProviders } from "@/hooks/useProviders";
import { resetGlobalStore, useGlobalStore } from "@/stores/global";
import type {
	AddFavoriteProviderInput,
	ProviderSearchForCountry,
	ProvidersInput,
	ProvidersOutput,
	RemoveFavoriteProviderInput,
} from "@/tauri/types";

const ALL = {
	CA: {
		providers: [
			{
				key: "netflix",
				name: "Netflix",
				priceTypes: ["FLATRATE"],
				logo: null,
				parentKey: null,
				weight: null,
			},
			{
				key: "hulu",
				name: "Hulu",
				priceTypes: ["FLATRATE"],
				logo: null,
				parentKey: null,
				weight: null,
			},
			{
				key: "disney_plus",
				name: "Disney+",
				priceTypes: ["FLATRATE"],
				logo: null,
				parentKey: null,
				weight: null,
			},
		],
	},
} satisfies Partial<Record<Country, ProvidersOutput>>;

const initialFavs = [
	{
		key: "netflix",
		name: "Netflix",
		priceTypes: ["FLATRATE"],
		logo: null,
		parentKey: null,
		weight: null,
	},
] satisfies ProvidersOutput["providers"];

let FAVORITES = {
	CA: {
		providers: initialFavs,
	},
} satisfies Partial<Record<Country, ProvidersOutput>>;

function Harness() {
	const { getProviders, addToFavorites, removeFromFavorites } = useProviders();
	const isLoading = useGlobalStore(st => st.providers.isLoading);
	const providers = useGlobalStore(st => st.providers.providers);
	const favorites = useGlobalStore(st => st.providers.favorites);

	return (
		<div>
			<button type="button" onClick={() => getProviders("CA")}>
				load
			</button>
			<button type="button" onClick={() => addToFavorites("disney_plus")}>
				addFav
			</button>
			<button type="button" onClick={() => removeFromFavorites("netflix")}>
				rmFav
			</button>

			<div data-testid="loading">{String(isLoading)}</div>
			<div data-testid="all">{JSON.stringify(providers ?? [])}</div>
			<div data-testid="favs">{JSON.stringify(favorites ?? [])}</div>
		</div>
	);
}

function renderWithHarness() {
	return render(
		<MemoryRouter>
			<CountryProvider>
				<Harness />
			</CountryProvider>
		</MemoryRouter>
	);
}

beforeEach(async () => {
	useGlobalStore.getState().preferences.setPreferences({
		country: "CA",
		language: "en",
	});

	FAVORITES = {
		CA: {
			providers: initialFavs,
		},
	} satisfies Partial<Record<Country, ProvidersOutput>>;

	mockIPC((cmd, args: unknown) => {
		if (cmd === "providers") {
			const {
				params: { country, favorites },
			} = args as { params: ProvidersInput };
			if (country !== "CA") return [];
			return favorites ? FAVORITES[country] : ALL[country];
		}

		if (cmd === "add_favorites_provider") {
			const {
				params: { country, providerKey },
			} = args as { params: AddFavoriteProviderInput };

			if (country !== "CA") return [];

			const base = FAVORITES[country] ?? [];
			const toAdd = (ALL[country] ?? []).providers.find(p => p.key === providerKey);
			const exists = base.providers.some(p => p.key === providerKey);

			const providers = exists || !toAdd ? base.providers.slice() : [...base.providers, toAdd];

			FAVORITES = {
				...FAVORITES,
				[country]: {
					providers,
				},
			};

			return;
		}

		if (cmd === "remove_favorites_provider") {
			const {
				params: { country, providerKey },
			} = args as { params: RemoveFavoriteProviderInput };

			if (country !== "CA") return [];

			const base = FAVORITES[country] ?? [];
			const providers = base.providers.filter(p => p.key !== providerKey);
			FAVORITES = {
				...FAVORITES,
				[country]: {
					providers,
				},
			};

			return;
		}
	});
});

afterEach(() => {
	clearMocks();
	resetGlobalStore();
});

describe("useProviders", () => {
	it("getProviders populates store", async () => {
		const r = renderWithHarness();
		await act(async () => {});

		await userEvent.click(screen.getByText("load"));
		await waitFor(() => {
			const all = JSON.parse(screen.getByTestId("all").textContent || "[]");
			const favs = JSON.parse(screen.getByTestId("favs").textContent || "[]");

			expect(all.map((p: ProviderSearchForCountry) => p.key)).toEqual([
				"netflix",
				"hulu",
				"disney_plus",
			]);
			expect(favs.map((p: ProviderSearchForCountry) => p.key)).toEqual(["netflix"]);
		});

		r.unmount();
	});

	it("add favorite", async () => {
		const r = renderWithHarness();
		await act(async () => {});

		await userEvent.click(screen.getByText("load"));
		await waitFor(() => {
			const favs = JSON.parse(screen.getByTestId("favs").textContent || "[]");
			expect(favs.map((p: ProviderSearchForCountry) => p.key)).toEqual(["netflix"]);
		});

		await userEvent.click(screen.getByText("addFav"));
		await waitFor(() => {
			const favs = JSON.parse(screen.getByTestId("favs").textContent || "[]") || [];
			expect(favs.map((p: ProviderSearchForCountry) => p.key)).toEqual(["netflix", "disney_plus"]);
		});

		r.unmount();
	});

	it("remove favorite", async () => {
		const r = renderWithHarness();
		await act(async () => {});

		await userEvent.click(screen.getByText("load"));
		await waitFor(() => {
			const favs = JSON.parse(screen.getByTestId("favs").textContent || "[]");
			expect(favs.map((p: ProviderSearchForCountry) => p.key)).toEqual(["netflix"]);
		});

		await userEvent.click(screen.getByText("rmFav"));
		await waitFor(() => {
			const favs = JSON.parse(screen.getByTestId("favs").textContent || "[]") || [];
			expect(favs.map((p: ProviderSearchForCountry) => p.key)).toEqual([]);
		});

		r.unmount();
	});
});
