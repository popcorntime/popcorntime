import { type ProviderSearchForCountry, SortKey } from "@popcorntime/graphql/types";
import i18next from "i18next";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetGlobalStore, useGlobalStore } from "@/stores/global";

const mkProv = (key: string) => ({ key }) as ProviderSearchForCountry;
const setAllReady = () => {
	const s = useGlobalStore.getState();
	s.providers.setInitialized();
	s.session.setInitialized();
	s.preferences.setInitialized();
	s.settings.setOnboarded(true);
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
		useGlobalStore.getState().i18n.setLocale("ar");

		// effect
		expect(spy).toHaveBeenCalledWith("ar");
		expect(useGlobalStore.getState().i18n.direction).toBe("rtl");
		expect(document.documentElement.getAttribute("dir")).toBe("rtl");

		spy.mockRestore();
	});

	it("preferences.setPreferences(language) also updates i18n.locale", () => {
		useGlobalStore.getState().preferences.setPreferences({ language: "fr", country: "CA" });
		expect(useGlobalStore.getState().i18n.locale).toBe("fr");
	});
});

describe("boot & app flags", () => {
	it("sets app.initialized when all dependencies are ready", () => {
		expect(useGlobalStore.getState().app.initialized).toBe(false);
		setAllReady();
		expect(useGlobalStore.getState().app.initialized).toBe(true);
	});

	it("sets app.bootInitialized when session + settings are ready", () => {
		const s = useGlobalStore.getState();
		expect(s.app.bootInitialized).toBe(false);
		s.session.setInitialized();
		s.settings.setOnboarded(true);
		expect(useGlobalStore.getState().app.bootInitialized).toBe(true);
	});

	it("sets version & nightly", () => {
		const s = useGlobalStore.getState();
		s.app.setVersion("1.2.3");
		s.app.setNightly(true);
		expect(useGlobalStore.getState().app.version).toBe("1.2.3");
		expect(useGlobalStore.getState().app.nightly).toBe(true);
	});
});

describe("favorites sync → browse.args.providers", () => {
	it("writes providers keys when providers.initialized && preferFavorites", () => {
		const s = useGlobalStore.getState();
		s.providers.setInitialized();
		// preferFavorites defaults to true in your store
		s.providers.setFavorites([mkProv("netflix"), mkProv("hulu"), mkProv("netflix")]);

		const args = useGlobalStore.getState().browse.args;
		expect(args?.providers).toEqual(["netflix", "hulu"]);
	});

	it("removes providers filter when preferFavorites toggles off", () => {
		const s = useGlobalStore.getState();
		s.providers.setInitialized();
		s.providers.setFavorites([mkProv("netflix")]);
		expect(useGlobalStore.getState().browse.args?.providers).toEqual(["netflix"]);

		s.browse.togglePreferFavorites(); // -> false
		expect(useGlobalStore.getState().browse.args?.providers).toBeUndefined();
	});
});

describe("browse setters", () => {
	it("sets query/cursor/args/sortKey", () => {
		const s = useGlobalStore.getState();
		s.browse.setQuery("batman");
		s.browse.setCursor("abc123");
		s.browse.setArgs({ year: 2024 });
		s.browse.setSortKey(SortKey.CREATED_AT);

		const st = useGlobalStore.getState().browse;
		expect(st.query).toBe("batman");
		expect(st.cursor).toBe("abc123");
		expect(st.args).toEqual({ year: 2024 });
		expect(st.sortKey).toBe(SortKey.CREATED_AT);
	});
});

describe("dialogs behavior", () => {
	it("media.open sets slug and isOpen, toggle clears slug and flips isOpen", () => {
		const s = useGlobalStore.getState();

		expect(s.dialogs.media.isOpen).toBe(false);
		expect(s.dialogs.media.slug).toBeUndefined();

		s.dialogs.media.open("some-slug");
		expect(useGlobalStore.getState().dialogs.media.isOpen).toBe(true);
		expect(useGlobalStore.getState().dialogs.media.slug).toBe("some-slug");

		s.dialogs.media.toggle();
		expect(useGlobalStore.getState().dialogs.media.isOpen).toBe(false);
		expect(useGlobalStore.getState().dialogs.media.slug).toBeUndefined();
	});

	it("preferences.toggle is prevented when prefs not set, but allowed otherwise", () => {
		const s = useGlobalStore.getState();

		// not initialized initially; open -> allowed
		s.dialogs.preferences.toggle();
		expect(useGlobalStore.getState().dialogs.preferences.isOpen).toBe(true);

		// mark preferences initialized with nothing set -> prevent closing
		s.preferences.setInitialized();
		s.dialogs.preferences.toggle();
		expect(useGlobalStore.getState().dialogs.preferences.isOpen).toBe(true);

		// set preferences -> auto closing
		s.preferences.setPreferences({ country: "CA", language: "en" });
		expect(useGlobalStore.getState().dialogs.preferences.isOpen).toBe(false);
	});

	it("auto-opens preferences when session active & app initialized but missing prefs", () => {
		const s = useGlobalStore.getState();
		setAllReady();

		expect(useGlobalStore.getState().app.initialized).toBe(true);
		expect(useGlobalStore.getState().dialogs.preferences.isOpen).toBe(false);

		s.session.setIsActive(true);
		expect(useGlobalStore.getState().dialogs.preferences.isOpen).toBe(true);

		s.preferences.setPreferences({ country: "CA", language: "en" });
		expect(useGlobalStore.getState().dialogs.preferences.isOpen).toBe(false);

		// should be closable
		s.dialogs.preferences.toggle();
		expect(useGlobalStore.getState().dialogs.preferences.isOpen).toBe(true);
		s.dialogs.preferences.toggle();
		expect(useGlobalStore.getState().dialogs.preferences.isOpen).toBe(false);
	});
});

describe("session/logout reset", () => {
	it("resetGlobalStore is called on logout (isActive=false) and clears state", () => {
		const s = useGlobalStore.getState();
		setAllReady();

		// mutate some state
		s.app.setVersion("9.9.9");
		s.browse.setQuery("x");
		s.session.setIsActive(true);

		// now simulate logout
		s.session.setIsActive(false);

		const st = useGlobalStore.getState();
		expect(st.app.version).toBeUndefined();
		expect(st.browse.query).toBeUndefined();
		expect(st.providers.initialized).toBe(false);
	});
});

describe("updater setters", () => {
	it("sets status/progress/availableUpdate/lastChecked", () => {
		const s = useGlobalStore.getState();

		s.updater.setStatus("available");
		s.updater.setProgress("downloading");
		// biome-ignore lint/suspicious/noExplicitAny: test store reactvitiy
		s.updater.setAvailableUpdate({ version: "1.0.0" } as any);
		const when = new Date();
		s.updater.setLastChecked(when);

		const u = useGlobalStore.getState().updater;
		expect(u.status).toBe("available");
		expect(u.progress).toBe("downloading");
		expect(u.availableUpdate?.version).toBe("1.0.0");
		expect(u.lastChecked?.getTime()).toBe(when.getTime());
	});
});
