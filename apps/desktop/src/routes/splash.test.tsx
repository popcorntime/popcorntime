import { act, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { SplashRoute } from "@/routes/splash";
import { resetGlobalStore, useGlobalStore } from "@/stores/global";

function LocationProbe() {
	const { pathname } = useLocation();
	return <div data-testid="loc">{pathname}</div>;
}

function renderWithRouter(initialPath = "/") {
	return render(
		<MemoryRouter initialEntries={[initialPath]}>
			<Routes>
				<Route
					path="/"
					element={
						<div data-testid="splash">
							<SplashRoute />
						</div>
					}
				/>
				<Route path="/onboarding" element={<div data-testid="onboarding" />} />
				<Route path="/login" element={<div data-testid="login" />} />
				<Route path="/browse" element={<div data-testid="browse" />} />
			</Routes>
			<LocationProbe />
		</MemoryRouter>
	);
}

afterEach(() => {
	resetGlobalStore();
});

describe("SplashRoute", () => {
	it("shows Splash while boot is not initialized", async () => {
		useGlobalStore.setState(s => {
			s.app.boot = "cold";
			s.settings.onboardingComplete = false;
			s.session.isActive = false;
		});

		const r = renderWithRouter("/");
		await act(async () => {});

		expect(screen.getByTestId("splash")).toBeInTheDocument();
		expect(screen.getByTestId("loc")).toHaveTextContent("/");

		r.unmount();
	});

	it("redirects to onboarding when not onboarded", async () => {
		useGlobalStore.setState(s => {
			s.app.boot = "booted";
			s.settings.onboardingComplete = false;
		});

		const r = renderWithRouter("/");
		await act(async () => {});

		expect(screen.getByTestId("onboarding")).toBeInTheDocument();
		expect(screen.getByTestId("loc")).toHaveTextContent("/onboarding");

		r.unmount();
	});

	it("redirects to login when onboarded but session is not active", async () => {
		useGlobalStore.setState(s => {
			s.app.boot = "booted";
			s.session.status = "ready";
			s.settings.onboardingComplete = true;
		});

		const r = renderWithRouter("/");
		await act(async () => {});

		expect(screen.getByTestId("login")).toBeInTheDocument();
		expect(screen.getByTestId("loc")).toHaveTextContent("/login");

		r.unmount();
	});

	it("shows splash when active but app not initialized", async () => {
		useGlobalStore.setState(s => {
			s.app.boot = "booting";
			s.settings.onboardingComplete = true;
			s.session.isActive = true;
			// missing providers
		});

		const r = renderWithRouter("/");
		await act(async () => {});

		expect(screen.getByTestId("splash")).toBeInTheDocument();
		expect(screen.getByTestId("loc")).toHaveTextContent("/");

		r.unmount();
	});

	it("redirects to browser when active and app initialized", async () => {
		useGlobalStore.setState(s => {
			s.app.boot = "booted";
			// prevent onboarding
			s.settings.onboardingComplete = true;
			// prevent login
			s.session.isActive = true;
			s.preferences.country = "CA";
		});

		const r = renderWithRouter("/");
		await act(async () => {});

		expect(screen.getByTestId("browse")).toBeInTheDocument();
		expect(screen.getByTestId("loc")).toHaveTextContent("/browse");
		r.unmount();
	});

	it("reacts when app initialization flips", async () => {
		useGlobalStore.setState(s => {
			s.app.boot = "cold";
			s.settings.onboardingComplete = true;
		});

		const r = renderWithRouter("/");
		await act(async () => {});

		expect(screen.getByTestId("splash")).toBeInTheDocument();

		await act(async () =>
			useGlobalStore.setState(s => {
				s.app.boot = "booted";
				s.session.isActive = true;
				s.preferences.country = "FR";
			})
		);

		expect(screen.getByTestId("browse")).toBeInTheDocument();
		expect(screen.getByTestId("loc")).toHaveTextContent("/browse");

		r.unmount();
	});
});
