import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { resetCommandCenterStore, useCommandCenterStore } from "@/stores/command-center";

beforeEach(() => {
	resetCommandCenterStore();
});

afterEach(() => {
	resetCommandCenterStore();
});

describe("useCommandCenterStore", () => {
	it("defaults", () => {
		const s = useCommandCenterStore.getState();
		expect(s.isOpen).toBe(false);
		expect(s.isLoading).toBe(false);
		expect(s.query).toBeUndefined();
		expect(s.view).toBe("main");
	});

	it("toggle open/close", () => {
		const s = useCommandCenterStore.getState();
		s.toggle();
		expect(useCommandCenterStore.getState().isOpen).toBe(true);
		s.toggle();
		expect(useCommandCenterStore.getState().isOpen).toBe(false);
	});

	it("set loading", () => {
		const s = useCommandCenterStore.getState();
		s.setIsLoading(true);
		expect(useCommandCenterStore.getState().isLoading).toBe(true);
		s.setIsLoading(false);
		expect(useCommandCenterStore.getState().isLoading).toBe(false);
	});

	it("set query", () => {
		const s = useCommandCenterStore.getState();
		s.setQuery("batman");
		expect(useCommandCenterStore.getState().query).toBe("batman");
		s.setQuery(undefined);
		expect(useCommandCenterStore.getState().query).toBeUndefined();
	});

	it("goto switches view", () => {
		const s = useCommandCenterStore.getState();
		s.goto("country-selection");
		expect(useCommandCenterStore.getState().view).toBe("country-selection");
		s.goto("search-result");
		expect(useCommandCenterStore.getState().view).toBe("search-result");
	});

	it("reset returns to defaults", () => {
		const s = useCommandCenterStore.getState();
		s.toggle();
		s.setIsLoading(true);
		s.setQuery("hello");
		s.goto("country-selection");

		s.reset();

		const st = useCommandCenterStore.getState();
		expect(st.isOpen).toBe(false);
		expect(st.isLoading).toBe(false);
		expect(st.query).toBeUndefined();
		expect(st.view).toBe("main");
	});
});
