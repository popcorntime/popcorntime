import { act, render } from "@testing-library/react";
import { MemoryRouter, Outlet, Route, Routes } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { CountryProvider, useCountry } from "@/hooks/useCountry";
import { resetGlobalStore, useGlobalStore } from "@/stores/global";

function CountryProbe() {
	const { country } = useCountry();
	return <div data-testid="country">{country}</div>;
}

function LayoutWithCountry() {
	return (
		<CountryProvider>
			<CountryProbe />
			<Outlet />
		</CountryProvider>
	);
}

afterEach(() => {
	resetGlobalStore();
});

const renderWithProvider = (initialEntry: string = "/browse") =>
	render(
		<MemoryRouter initialEntries={[initialEntry]}>
			<Routes>
				<Route path="/browse" element={<LayoutWithCountry />}>
					<Route index element={<div data-testid="browse" />} />
				</Route>
			</Routes>
		</MemoryRouter>
	);

describe("useCountry", () => {
	it("make sure params country is priorized", async () => {
		useGlobalStore.setState(s => {
			s.preferences.country = "US";
			s.preferences.language = "fr";
		});

		const r = renderWithProvider("/browse?country=CA");
		await act(async () => {});

		expect(r.getByTestId("country").textContent).toBe("CA");

		r.unmount();
	});

	it("make sure preferences are respected", async () => {
		useGlobalStore.setState(s => {
			s.preferences.country = "NL";
			s.preferences.language = "nl";
		});

		const r = renderWithProvider();
		await act(async () => {});

		expect(r.getByTestId("country").textContent).toBe("NL");

		r.unmount();
	});
});
