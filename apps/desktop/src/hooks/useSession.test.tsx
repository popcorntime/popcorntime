import { clearMocks, mockIPC } from "@tauri-apps/api/mocks";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { SessionProvider } from "@/hooks/useSession";
import { TauriError } from "@/hooks/useTauri";
import { resetGlobalStore, useGlobalStore } from "@/stores/global";
import { Code } from "@/utils/error";

function LocationProbe() {
	const { pathname } = useLocation();
	return <div data-testid="loc">{pathname}</div>;
}

const renderWithProvider = (initialIndex: number) =>
	render(
		<MemoryRouter initialEntries={["/", "/browse/us", "/login"]} initialIndex={initialIndex}>
			<SessionProvider>
				<div data-testid="root" />
				<LocationProbe />
			</SessionProvider>
		</MemoryRouter>
	);

afterEach(() => {
	clearMocks();
	resetGlobalStore();
});

describe("SessionProvider with mockIPC", () => {
	it("should not be onboarded and stay on splash", async () => {
		mockIPC((cmd, _args) => {
			if (cmd === "validate")
				throw new TauriError("Invalid session", Code.InvalidSession, undefined);
		});

		const s = useGlobalStore.getState();
		s.settings.setOnboarded(true);
		expect(useGlobalStore.getState().settings.initialized).toBe(true);

		const r = renderWithProvider(0);
		await act(async () => {});

		expect(screen.getByTestId("loc")).toHaveTextContent("/");
		r.unmount();
	});

	it("should redirect to login (private page)", async () => {
		mockIPC((cmd, _args) => {
			if (cmd === "validate")
				throw new TauriError("Invalid session", Code.InvalidSession, undefined);
		});

		const s = useGlobalStore.getState();
		s.settings.setOnboarded(true);
		expect(useGlobalStore.getState().settings.initialized).toBe(true);

		const r = renderWithProvider(1);
		await act(async () => {});

		expect(screen.getByTestId("loc")).toHaveTextContent("/login");
		r.unmount();
	});

	it("should initialize app with session", async () => {
		mockIPC((cmd, _args) => {
			if (cmd === "validate") null;
			if (cmd === "user_preferences") return { country: "US", language: "fr" };
		});

		const s = useGlobalStore.getState();
		s.settings.setOnboarded(true);
		expect(useGlobalStore.getState().settings.initialized).toBe(true);
		expect(useGlobalStore.getState().app.initialized).toBe(false);
		expect(useGlobalStore.getState().preferences.initialized).toBe(false);
		expect(useGlobalStore.getState().session.initialized).toBe(false);
		expect(useGlobalStore.getState().providers.initialized).toBe(false);

		const r = renderWithProvider(1);
		await act(async () => {});

		expect(useGlobalStore.getState().session.initialized).toBe(true);
		expect(useGlobalStore.getState().session.isActive).toBe(true);
		expect(useGlobalStore.getState().providers.initialized).toBe(true);
		expect(useGlobalStore.getState().preferences.initialized).toBe(true);
		expect(useGlobalStore.getState().preferences.country).toBe("US");
		expect(useGlobalStore.getState().preferences.language).toBe("fr");
		expect(useGlobalStore.getState().app.initialized).toBe(true);

		r.unmount();
	});

	it("should not initialize the app without preferences", async () => {
		mockIPC((cmd, _args) => {
			if (cmd === "validate") null;
			if (cmd === "user_preferences") return null;
		});

		const s = useGlobalStore.getState();
		s.settings.setOnboarded(true);
		expect(useGlobalStore.getState().settings.initialized).toBe(true);
		expect(useGlobalStore.getState().app.initialized).toBe(false);
		expect(useGlobalStore.getState().preferences.initialized).toBe(false);
		expect(useGlobalStore.getState().session.initialized).toBe(false);
		expect(useGlobalStore.getState().providers.initialized).toBe(false);

		const r = renderWithProvider(1);
		await act(async () => {});

		expect(useGlobalStore.getState().session.initialized).toBe(true);
		expect(useGlobalStore.getState().session.isActive).toBe(true);
		expect(useGlobalStore.getState().preferences.initialized).toBe(true);
		expect(useGlobalStore.getState().providers.initialized).toBe(false);
		expect(useGlobalStore.getState().app.initialized).toBe(false);
		expect(useGlobalStore.getState().dialogs.preferences.isOpen).toBe(true);

		await act(async () => s.preferences.setPreferences({ country: "US", language: "fr" }));

		expect(useGlobalStore.getState().preferences.country).toBe("US");
		expect(useGlobalStore.getState().preferences.language).toBe("fr");

		expect(useGlobalStore.getState().dialogs.preferences.isOpen).toBe(false);
		expect(useGlobalStore.getState().providers.initialized).toBe(true);
		expect(useGlobalStore.getState().app.initialized).toBe(true);

		r.unmount();
	});
});
