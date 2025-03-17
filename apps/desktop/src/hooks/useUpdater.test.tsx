import { clearMocks, mockIPC } from "@tauri-apps/api/mocks";
import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { UpdaterProvider } from "@/hooks/useUpdater";
import { resetGlobalStore, useGlobalStore } from "@/stores/global";
import { toast } from "@/test/mock";

const renderWithProvider = () =>
	render(
		<UpdaterProvider>
			<div data-testid="root" />
		</UpdaterProvider>
	);

beforeEach(() => {
	mockIPC((cmd, _args) => {
		if (cmd === "plugin:app|name") return "Popcorn Time";
		if (cmd === "plugin:app|version") return "1.0.0";
		if (cmd === "plugin:updater|check") {
			return {
				available: true,
				version: "9.9.9",
				download: async (
					_onEvt: (ev: { event: "Started" | "Progress" | "Finished" }) => void
				) => {},
				install: async () => {},
			};
		}
	});
});

afterEach(() => {
	clearMocks();
	resetGlobalStore();
});

describe("UpdaterProvider with mockIPC", () => {
	it("mount check + sets available update", async () => {
		const r = renderWithProvider();
		await act(async () => {});

		const s = useGlobalStore.getState();
		expect(s.updater.status).toBe("available");
		expect(s.updater.availableUpdate?.version).toBe("9.9.9");

		r.unmount();
	});

	it("shows toast on update available", async () => {
		const r = renderWithProvider();
		await act(async () => {});

		expect(toast).toHaveBeenCalled();

		r.unmount();
	});
});
