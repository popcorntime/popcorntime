import { clearMocks, mockIPC } from "@tauri-apps/api/mocks";
import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PreferencesLoaderMount } from "@/loaders/preferences";
import { resetGlobalStore, useGlobalStore } from "@/stores/global";
import type { PreferencesOutput } from "@/tauri/types";

afterEach(() => {
	clearMocks();
	resetGlobalStore();
});

describe("PreferencesLoaderMount", () => {
	it("handle valid preferences", async () => {
		mockIPC((cmd, _args) => {
			if (cmd === "user_preferences")
				return {
					preferences: { country: "US", language: "fr" },
				} satisfies PreferencesOutput;
		});

		// mark session as active
		useGlobalStore.getState().sessionSucceeded(true);

		const r = render(<PreferencesLoaderMount />);
		await act(async () => {});

		expect(useGlobalStore.getState().preferences.status).toBe("ready");
		expect(useGlobalStore.getState().preferences.country).toBe("US");
		expect(useGlobalStore.getState().preferences.language).toBe("fr");

		r.unmount();
	});

	it("handle empty preferences", async () => {
		mockIPC((cmd, _args) => {
			if (cmd === "user_preferences")
				return {
					preferences: null,
				} satisfies PreferencesOutput;
		});

		// mark session as active
		useGlobalStore.getState().sessionSucceeded(true);

		const r = render(<PreferencesLoaderMount />);
		await act(async () => {});

		expect(useGlobalStore.getState().preferences.status).toBe("ready");
		expect(useGlobalStore.getState().preferences.country).toBeUndefined();
		expect(useGlobalStore.getState().preferences.language).toBeUndefined();

		r.unmount();
	});

	it("handle invalid preferences", async () => {
		mockIPC((cmd, _args) => {
			if (cmd === "user_preferences")
				throw { message: "Failed to get preferences", code: "errors.graphql.server" };
		});

		// mark session as active
		useGlobalStore.getState().sessionSucceeded(true);

		const r = render(<PreferencesLoaderMount />);
		await act(async () => {});

		expect(useGlobalStore.getState().preferences.status).toBe("error");
		expect(useGlobalStore.getState().preferences.error?.code).toBe("errors.graphql.server");
		r.unmount();
	});

	it("handle idle preferences", async () => {
		mockIPC((cmd, _args) => {
			if (cmd === "user_preferences")
				return {
					preferences: { country: "US", language: "fr" },
				} satisfies PreferencesOutput;
		});

		const r = render(<PreferencesLoaderMount />);
		await act(async () => {});

		// if session is not active, preferences should remain idle
		expect(useGlobalStore.getState().preferences.status).toBe("idle");

		// now, mark session as active
		await act(async () => useGlobalStore.getState().sessionSucceeded(true));

		expect(useGlobalStore.getState().preferences.status).toBe("ready");
		r.unmount();
	});
});
