import type { Country } from "@popcorntime/i18n/types";
import { clearMocks, mockIPC } from "@tauri-apps/api/mocks";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMemo } from "react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { CountryProvider } from "@/hooks/useCountry";
import { useProviders } from "@/hooks/useProviders";
import { resetGlobalStore, useGlobalStore } from "@/stores/global";
import type {
	Provider,
	ProvidersInput,
	ProvidersOutput,
	SetFavoriteProviderInput,
} from "@/tauri/types";

const initialProviders = [
	{
		key: "netflix",
		favorite: true,
		name: "Netflix",
		priceTypes: ["FLATRATE"],
		logo: null,
		parentKey: null,
		weight: null,
	},
	{
		key: "hulu",
		favorite: false,
		name: "Hulu",
		priceTypes: ["FLATRATE"],
		logo: null,
		parentKey: null,
		weight: null,
	},
	{
		key: "disney_plus",
		favorite: false,
		name: "Disney+",
		priceTypes: ["FLATRATE"],
		logo: null,
		parentKey: null,
		weight: null,
	},
] as Provider[];
let ALL = {
	CA: {
		providers: initialProviders,
	},
} satisfies Partial<Record<Country, ProvidersOutput>>;

function Harness() {
	const { getProviders, addToFavorites, removeFromFavorites } = useProviders();
	const isLoading = useGlobalStore(st => st.providers.isLoading);
	const providers = useGlobalStore(st => st.providers.providers);
	const favorites = useMemo(() => providers?.filter(p => p.favorite), [providers]);

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

	ALL = {
		CA: {
			providers: initialProviders,
		},
	} satisfies Partial<Record<Country, ProvidersOutput>>;

	mockIPC((cmd, args: unknown) => {
		if (cmd === "providers") {
			const {
				params: { country },
			} = args as { params: ProvidersInput };
			if (country !== "CA") {
				console.warn("Unexpected country", country);
				return {};
			}
			return ALL[country];
		}

		if (cmd === "set_favorites_provider") {
			const {
				params: { country, providerKey, favorite },
			} = args as { params: SetFavoriteProviderInput };

			if (country !== "CA") {
				console.warn("Unexpected country", country);
				return {};
			}

			ALL = {
				...ALL,
				[country]: {
					...ALL[country],
					providers: ALL[country].providers.map(p =>
						p.key === providerKey ? { ...p, favorite } : p
					),
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

			expect(all.map((p: Provider) => p.key)).toEqual(["netflix", "hulu", "disney_plus"]);
			expect(favs.map((p: Provider) => p.key)).toEqual(["netflix"]);
		});

		r.unmount();
	});

	it("add favorite", async () => {
		const r = renderWithHarness();
		await act(async () => {});

		await userEvent.click(screen.getByText("load"));
		await waitFor(() => {
			const favs = JSON.parse(screen.getByTestId("favs").textContent || "[]");
			expect(favs.map((p: Provider) => p.key)).toEqual(["netflix"]);
		});

		await userEvent.click(screen.getByText("addFav"));
		await waitFor(() => {
			const favs = JSON.parse(screen.getByTestId("favs").textContent || "[]") || [];
			expect(favs.map((p: Provider) => p.key)).toEqual(["netflix", "disney_plus"]);
		});

		expect(useGlobalStore.getState().providers.haveFavorites).toBe(true);

		r.unmount();
	});

	it("remove favorite", async () => {
		const r = renderWithHarness();
		await act(async () => {});

		await userEvent.click(screen.getByText("load"));
		await waitFor(() => {
			const favs = JSON.parse(screen.getByTestId("favs").textContent || "[]");
			expect(favs.map((p: Provider) => p.key)).toEqual(["netflix"]);
		});

		await userEvent.click(screen.getByText("rmFav"));
		await waitFor(() => {
			const favs = JSON.parse(screen.getByTestId("favs").textContent || "[]") || [];
			expect(favs.map((p: Provider) => p.key)).toEqual([]);
		});

		expect(useGlobalStore.getState().providers.haveFavorites).toBe(false);

		r.unmount();
	});
});
