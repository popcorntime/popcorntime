import { clearMocks, mockIPC } from "@tauri-apps/api/mocks";
import { act, render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { SettingsProvider } from "@/hooks/useSettings";
import { resetGlobalStore, useGlobalStore } from "@/stores/global";

const renderWithProvider = () =>
	render(
		<MemoryRouter>
			<SettingsProvider>
				<div data-testid="root" />
			</SettingsProvider>
		</MemoryRouter>
	);

afterEach(() => {
	clearMocks();
	resetGlobalStore();
});

describe("useSettings", () => {
	it("should not be onboarded", async () => {
		mockIPC((cmd, _args) => {
			if (cmd === "is_onboarded") return false;
		});

		const r = renderWithProvider();
		await act(async () => {});

		expect(useGlobalStore.getState().settings.onboarded).toBe(false);

		r.unmount();
	});

	it("should be onboarded", async () => {
		mockIPC((cmd, _args) => {
			if (cmd === "is_onboarded") return true;
		});

		const r = renderWithProvider();
		await act(async () => {});

		expect(useGlobalStore.getState().settings.onboarded).toBe(true);

		r.unmount();
	});
});
