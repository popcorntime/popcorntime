import { type ProviderSearchForCountry, WatchPriceType } from "@popcorntime/graphql/types";
import type { Country } from "@popcorntime/i18n/types";
import { clearMocks, mockIPC } from "@tauri-apps/api/mocks";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { resetGlobalStore, useGlobalStore } from "@/stores/global";

const ALL = {
	CA: [
		{
			id: "1",
			key: "netflix",
			name: "Netflix",
			priceTypes: [WatchPriceType.FLATRATE],
		},
		{
			id: "2",
			key: "hulu",
			name: "Hulu",
			priceTypes: [WatchPriceType.FLATRATE],
		},
		{
			id: "3",
			key: "disney_plus",
			name: "Disney+",
			priceTypes: [WatchPriceType.FLATRATE],
		},
	],
} satisfies Partial<Record<Country, ProviderSearchForCountry[]>>;

const initialFavs = [
	{
		id: "1",
		key: "netflix",
		name: "Netflix",
		priceTypes: [WatchPriceType.FLATRATE],
	},
];

let FAVORITES = {
	CA: initialFavs,
} satisfies Partial<Record<Country, ProviderSearchForCountry[]>>;

import { CountryProvider } from "@/hooks/useCountry";
import { type InvokeParams, useProviders } from "@/hooks/useProviders";

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
		CA: initialFavs,
	};

	mockIPC((cmd, args: unknown) => {
		if (cmd === "providers") {
			const { params } = args as { params: InvokeParams };
			if (params.country !== "CA") return [];
			const { favorites, country } = params;
			return favorites ? FAVORITES[country] : ALL[country];
		}

		if (cmd === "add_favorites_provider") {
			const { params } = args as {
				params: { country: Country; providerKey: string };
			};

			if (params.country !== "CA") return [];

			const base = FAVORITES[params.country] ?? [];
			const toAdd = (ALL[params.country] ?? []).find(p => p.key === params.providerKey);
			const exists = base.some(p => p.key === params.providerKey);

			const next = exists || !toAdd ? base.slice() : [...base, toAdd];
			FAVORITES = { ...FAVORITES, [params.country]: next };

			return;
		}

		if (cmd === "remove_favorites_provider") {
			const { params } = args as {
				params: { country: Country; providerKey: string };
			};
			if (params.country !== "CA") return [];

			const base = FAVORITES[params.country] ?? [];
			const next = base.filter(p => p.key !== params.providerKey);
			FAVORITES = { ...FAVORITES, [params.country]: next };

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
