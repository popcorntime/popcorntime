import type { Country } from "@popcorntime/i18n/types";
import { clearMocks, mockIPC } from "@tauri-apps/api/mocks";
import { act, render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { CountryProvider } from "@/hooks/useCountry";
import { resetGlobalStore, useGlobalStore } from "@/stores/global";
import type { Provider, ProvidersInput, ProvidersOutput } from "@/tauri/types";
import { ProvidersLoaderMount } from "./providers";

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

afterEach(() => {
	ALL = {
		CA: {
			providers: initialProviders,
		},
	} satisfies Partial<Record<Country, ProvidersOutput>>;

	clearMocks();
	resetGlobalStore();
});

function renderWithHarness() {
	return render(
		<MemoryRouter>
			<CountryProvider>
				<ProvidersLoaderMount />
			</CountryProvider>
		</MemoryRouter>
	);
}

describe("ProvidersLoaderMount", () => {
	it("handle valid providers", async () => {
		mockIPC((cmd, args) => {
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
		});

		useGlobalStore.getState().sessionSucceeded(true);
		useGlobalStore.getState().preferencesSucceeded({
			country: "CA",
			language: "en",
		});

		const r = renderWithHarness();
		await act(async () => {});

		expect(useGlobalStore.getState().providers.status).toBe("ready");
		expect(useGlobalStore.getState().providers.providers.length).toBe(initialProviders.length);

		r.unmount();
	});

	it("handle invalid providers", async () => {
		mockIPC((cmd, _args) => {
			if (cmd === "providers")
				throw { message: "Failed to get providers", code: "errors.graphql.server" };
		});

		useGlobalStore.getState().sessionSucceeded(true);
		useGlobalStore.getState().preferencesSucceeded({
			country: "CA",
			language: "en",
		});

		const r = renderWithHarness();
		await act(async () => {});

		expect(useGlobalStore.getState().providers.status).toBe("error");
		expect(useGlobalStore.getState().providers.error?.code).toBe("errors.graphql.server");
		r.unmount();
	});
});
