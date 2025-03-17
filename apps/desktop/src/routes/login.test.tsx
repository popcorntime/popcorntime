import { emit } from "@tauri-apps/api/event";
import { mockIPC } from "@tauri-apps/api/mocks";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LoginRoute } from "@/routes/login";
import { resetGlobalStore, useGlobalStore } from "@/stores/global";
import { pluginShellOpen } from "@/test/mock";

const AUTH_URL = "https://popcorntime.app/authorize";

function LocationProbe() {
	const { pathname } = useLocation();
	return <div data-testid="loc">{pathname}</div>;
}

function renderWithRouter() {
	return render(
		<MemoryRouter initialEntries={["/login"]}>
			<Routes>
				<Route
					path="/login"
					element={
						<div data-testid="login">
							<LoginRoute />
						</div>
					}
				/>
				<Route path="/" element={<div data-testid="splash" />} />
			</Routes>
			<LocationProbe />
		</MemoryRouter>
	);
}

beforeEach(() => {
	mockIPC(
		(cmd, _args) => {
			if (cmd === "initialize_session_authorization") {
				emit("popcorntime://session_server_ready", {
					authorizeUrl: AUTH_URL,
				});
				return;
			}
		},
		{ shouldMockEvents: true }
	);
});

afterEach(() => {
	resetGlobalStore();
});

describe("LoginRoute", () => {
	it("shows login", async () => {
		const r = renderWithRouter();
		await act(async () => {});

		expect(screen.getByTestId("login")).toBeInTheDocument();
		expect(screen.getByTestId("loc")).toHaveTextContent("/login");

		r.unmount();
	});

	it("open oauth2 window", async () => {
		const r = renderWithRouter();
		await act(async () => {});

		expect(screen.getByTestId("login")).toBeInTheDocument();
		expect(screen.getByTestId("loc")).toHaveTextContent("/login");

		const btn = screen.getByRole("button", { name: "Login" });
		await act(async () => {
			btn.click();
		});

		expect(pluginShellOpen).toHaveBeenCalledWith(AUTH_URL);

		r.unmount();
	});

	it("redirect back to splash", async () => {
		const r = renderWithRouter();
		await act(async () => {});

		expect(screen.getByTestId("login")).toBeInTheDocument();
		expect(screen.getByTestId("loc")).toHaveTextContent("/login");

		await act(async () =>
			useGlobalStore.setState(s => {
				s.app.initialized = true;
			})
		);

		expect(screen.getByTestId("splash")).toBeInTheDocument();
		expect(screen.getByTestId("loc")).toHaveTextContent("/");

		r.unmount();
	});
});
