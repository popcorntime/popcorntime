import { clearMocks, mockIPC } from "@tauri-apps/api/mocks";
import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SettingsLoaderMount } from "@/loaders/settings";
import { resetGlobalStore, useGlobalStore } from "@/stores/global";

afterEach(() => {
	clearMocks();
	resetGlobalStore();
});

describe("SettingsLoaderMount", () => {
	it("handle valid onboarding", async () => {
		mockIPC((cmd, _args) => {
			if (cmd === "is_onboarded") return false;
		});

		useGlobalStore.getState().sessionSucceeded(true);

		const r = render(<SettingsLoaderMount />);
		await act(async () => {});

		expect(useGlobalStore.getState().settings.status).toBe("ready");
		expect(useGlobalStore.getState().settings.onboarded).toBe(false);

		r.unmount();
	});

	it("handle invalid onboarding flow", async () => {
		mockIPC((cmd, _args) => {
			if (cmd === "is_onboarded")
				throw { message: "Failed to get settings", code: "errors.graphql.server" };
		});

		useGlobalStore.getState().sessionSucceeded(true);

		const r = render(<SettingsLoaderMount />);
		await act(async () => {});

		expect(useGlobalStore.getState().settings.status).toBe("error");

		r.unmount();
	});
});
