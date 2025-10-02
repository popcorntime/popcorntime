import { Update } from "@tauri-apps/plugin-updater";
import i18next from "i18next";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetGlobalStore, useGlobalStore } from "@/stores/global";
import type { Provider } from "@/tauri/types";

const mkProv = (key: string, favorite: boolean) => ({ key, favorite }) as Provider;
const setAllReady = () => {
	const s = useGlobalStore.getState();
	s.providersSucceeded([]);
	s.sessionSucceeded(true);
	s.preferencesSucceeded({ country: "US", language: "en" });
	s.settingsSucceeded({ onboarded: true });
};

beforeEach(() => {
	resetGlobalStore();
});

afterEach(() => {
	resetGlobalStore();
});

describe("i18n", () => {
	it("updates locale and direction & calls i18next.changeLanguage", () => {
		// biome-ignore lint/suspicious/noExplicitAny: mock
		const spy = vi.spyOn(i18next, "changeLanguage").mockResolvedValue({} as any);
		expect(useGlobalStore.getState().i18n.locale).toBe("en");
		expect(document.documentElement.getAttribute("dir")).toBe(null);

		// action
		useGlobalStore.getState().setLocale("ar");

		// effect
		expect(spy).toHaveBeenCalledWith("ar");
		expect(useGlobalStore.getState().i18n.direction).toBe("rtl");
		expect(document.documentElement.getAttribute("dir")).toBe("rtl");

		spy.mockRestore();
	});

	it("preferences.setPreferences(language) also updates i18n.locale", () => {
		useGlobalStore.getState().preferencesSucceeded({ language: "fr", country: "CA" });
		expect(useGlobalStore.getState().i18n.locale).toBe("fr");
	});
});

describe("boot & app flags", () => {
	it("sets app booted", () => {
		expect(useGlobalStore.getState().app.boot).toBe("cold");
		setAllReady();
		expect(useGlobalStore.getState().app.boot).toBe("booted");
	});

	it("sets app booting", () => {
		expect(useGlobalStore.getState().app.boot).toBe("cold");
		useGlobalStore.getState().sessionSucceeded(false);
		useGlobalStore.getState().settingsSucceeded({ onboarded: false });
		expect(useGlobalStore.getState().app.boot).toBe("booting");
	});

	it("sets version & nightly", () => {
		const s = useGlobalStore.getState();
		s.setAppVersion("1.2.3", true);
		expect(useGlobalStore.getState().app.version).toBe("1.2.3");
		expect(useGlobalStore.getState().app.nightly).toBe(true);
	});
});

describe("dialogs behavior", () => {
	it("media.open sets slug and isOpen, toggle clears slug and flips isOpen", () => {
		const s = useGlobalStore.getState();

		expect(s.dialogs.media.isOpen).toBe(false);
		expect(s.dialogs.media.slug).toBeUndefined();

		s.openMedia("some-slug");
		expect(useGlobalStore.getState().dialogs.media.isOpen).toBe(true);
		expect(useGlobalStore.getState().dialogs.media.slug).toBe("some-slug");

		s.closeMedia();
		expect(useGlobalStore.getState().dialogs.media.isOpen).toBe(false);
		expect(useGlobalStore.getState().dialogs.media.slug).toBeUndefined();
	});

	it("preferences.toggle ", () => {
		const s = useGlobalStore.getState();

		s.togglePreferences();
		expect(useGlobalStore.getState().dialogs.preferences.isOpen).toBe(true);
		s.togglePreferences();
		expect(useGlobalStore.getState().dialogs.preferences.isOpen).toBe(false);
	});

	it("watchPreferences.toggle ", () => {
		const s = useGlobalStore.getState();

		s.toggleWatchPreferences();
		expect(useGlobalStore.getState().dialogs.watchPreferences.isOpen).toBe(true);
		s.toggleWatchPreferences();
		expect(useGlobalStore.getState().dialogs.watchPreferences.isOpen).toBe(false);
	});
});

describe("session cleared", () => {
	it("reset state", () => {
		const s = useGlobalStore.getState();
		setAllReady();

		// mutate some state
		s.setAppVersion("9.9.9", true);
		s.sessionSucceeded(true);

		// now simulate logout
		s.sessionCleared();

		const st = useGlobalStore.getState();
		expect(st.app.version).toBeUndefined();
		expect(st.providers.status).toBe("idle");
	});
});

describe("updater setters", () => {
	it("sets status/progress/availableUpdate/lastChecked", () => {
		const s = useGlobalStore.getState();

		s.updaterSucceeded(
			new Update({ currentVersion: "0.0.1", version: "0.0.2", rawJson: {}, rid: 0 })
		);
		s.updaterProgress("downloading");

		expect(useGlobalStore.getState().updater.availableUpdate).toBeDefined();
		expect(useGlobalStore.getState().updater.progress).toBe("downloading");
		expect(useGlobalStore.getState().updater.availableUpdate?.version).toBe("0.0.2");
	});
});

describe("favorites sync → browse.args.providers", () => {
	it("writes providers keys when providers.initialized && preferFavorites", () => {
		const s = useGlobalStore.getState();
		s.providersSucceeded([mkProv("netflix", true), mkProv("hulu", true), mkProv("prime", false)]);

		const args = useGlobalStore.getState().browse.args;
		expect(args?.providers).toEqual(["netflix", "hulu"]);
	});

	it("removes providers filter when preferFavorites toggles off", () => {
		const s = useGlobalStore.getState();
		s.providersSucceeded([mkProv("netflix", true), mkProv("hulu", false), mkProv("prime", false)]);
		expect(useGlobalStore.getState().browse.args?.providers).toEqual(["netflix"]);

		s.togglePreferFavorites();
		expect(useGlobalStore.getState().browse.args?.providers).toBeUndefined();
	});
});

describe("browse setters", () => {
	it("sets query/cursor/args/sortKey", () => {
		useGlobalStore.getState().browseUpdate({
			query: "batman",
			args: { year: 2024 },
			sortKey: "CREATED_AT",
		});

		const st = useGlobalStore.getState().browse;
		expect(st.query).toBe("batman");
		expect(st.args).toEqual({ year: 2024 });
		expect(st.sortKey).toBe("CREATED_AT");
		// default sortOrder
		expect(st.sortOrder).toBe("ASC");

		useGlobalStore.getState().browseUpdate({
			sortOrder: "DESC",
		});
		expect(useGlobalStore.getState().browse.sortOrder).toBe("DESC");
		expect(useGlobalStore.getState().browse.args).toEqual({ year: 2024 });
	});
});
