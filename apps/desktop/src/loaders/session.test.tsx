import { clearMocks, mockIPC } from "@tauri-apps/api/mocks";
import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SessionLoaderMount } from "@/loaders/session";
import { resetGlobalStore, useGlobalStore } from "@/stores/global";

afterEach(() => {
	clearMocks();
	resetGlobalStore();
});

describe("SessionLoaderMount", () => {
	it("handle invalid session", async () => {
		mockIPC((cmd, _args) => {
			if (cmd === "validate") throw { message: "Invalid session", code: "errors.session.invalid" };
		});

		render(<SessionLoaderMount />);
		await act(async () => {});

		expect(useGlobalStore.getState().session.status).toBe("ready");
		expect(useGlobalStore.getState().session.error).toBeUndefined();
		expect(useGlobalStore.getState().session.isActive).toBe(false);
	});

	it("handle valid session", async () => {
		mockIPC((cmd, _args) => {
			if (cmd === "validate") return null;
		});

		render(<SessionLoaderMount />);
		await act(async () => {});

		expect(useGlobalStore.getState().session.status).toBe("ready");
		expect(useGlobalStore.getState().session.error).toBeUndefined();
		expect(useGlobalStore.getState().session.isActive).toBe(true);
	});
});
