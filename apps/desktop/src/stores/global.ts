import { i18n } from "@popcorntime/i18n";
import type { Country, Locale } from "@popcorntime/i18n/types";
import type { Update } from "@tauri-apps/plugin-updater";
import i18next from "i18next";
import { getLangDir } from "rtl-detect";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { isTauriError, type TauriError } from "@/hooks/useTauri";
import { devtools } from "@/stores/devtools";
import type { Provider, SearchArguments, SortKey } from "@/tauri/types";

export type SortOrder = "ASC" | "DESC";
type UpdateProgress = "downloading" | "downloaded" | "installing" | "installed";
type Status = "idle" | "loading" | "ready" | "error";
type BootPhase = "cold" | "booting" | "booted";

interface i18nState {
	locale: Locale;
	direction: "ltr" | "rtl";
}

interface SessionState {
	status: Status;
	isActive: boolean;
	error?: TauriError;
}

interface PreferencesState {
	status: Status;
	country?: Country;
	language?: Locale;
	error?: TauriError;
}

interface SettingsState {
	status: Status;
	onboarded: boolean;
	error?: TauriError;
}

interface ProvidersState {
	status: Status;
	providers: Provider[];
	haveFavorites: boolean;
	error?: TauriError;
}

interface AppState {
	boot: BootPhase;
	version?: string;
	nightly: boolean;
}

interface UpdaterState {
	progress?: UpdateProgress;
	availableUpdate?: Update;
	lastChecked?: Date;
	error?: TauriError;
}

interface DialogMediaState {
	slug?: string;
	isOpen: boolean;
}

interface DialogPreferencesState {
	isOpen: boolean;
}

interface DialogWatchPreferencesState {
	isOpen: boolean;
}

interface DialogsState {
	media: DialogMediaState;
	preferences: DialogPreferencesState;
	watchPreferences: DialogWatchPreferencesState;
}

interface BrowseState {
	query?: string;
	args?: SearchArguments;
	sortKey: SortKey;
	sortOrder: SortOrder;
	preferFavorites: boolean;
}

interface GlobalState {
	i18n: i18nState;
	session: SessionState;
	preferences: PreferencesState;
	settings: SettingsState;
	providers: ProvidersState;
	app: AppState;
	updater: UpdaterState;
	dialogs: DialogsState;
	browse: BrowseState;
}

interface BrowseUpdateInput {
	query?: string;
	sortKey?: SortKey;
	sortOrder?: SortOrder;
	preferFavorites?: boolean;
	args?: SearchArguments;
}

interface GlobalMutations {
	setLocale: (locale: Locale) => void;
	setAppVersion(version: string, nightly: boolean): void;

	sessionRequested(): void;
	sessionSucceeded(isActive: boolean): void;
	sessionCleared(): void;
	sessionFailed(err: unknown): void;

	preferencesRequested(): void;
	preferencesSucceeded(prefs?: { country?: Country; language?: Locale }): void;
	preferencesFailed(err: unknown): void;

	settingsRequested(): void;
	settingsSucceeded(partial?: { onboarded?: boolean }): void;
	settingsFailed(err: unknown): void;

	providersRequested(): void;
	providersSucceeded(list: Provider[]): void;
	providersFailed(err: unknown): void;

	updaterSucceeded(update?: Update): void;
	updaterProgress(progress: UpdateProgress): void;
	updaterFailed(err: unknown): void;

	openMedia(slug?: string): void;
	closeMedia(): void;
	togglePreferences(): void;
	toggleWatchPreferences(): void;

	browseUpdate: (input: BrowseUpdateInput) => void;
	togglePreferFavorites: () => void;
}

export const useGlobalStore = create<GlobalState & GlobalMutations>()(
	devtools(
		subscribeWithSelector(
			immer(set => ({
				i18n: {
					locale: i18n.defaultLocale,
					direction: getLangDir(i18n.defaultLocale),
				},
				session: {
					status: "idle",
					isActive: false,
				},
				settings: {
					status: "idle",
					onboarded: false,
				},
				preferences: {
					status: "idle",
				},
				app: {
					boot: "cold",
					nightly: false,
				},
				providers: {
					status: "idle",
					providers: [],
					haveFavorites: false,
				},

				updater: {},

				dialogs: {
					media: {
						isOpen: false,
					},
					preferences: {
						isOpen: false,
					},
					watchPreferences: {
						isOpen: false,
					},
				},

				browse: {
					sortKey: "POSITION",
					sortOrder: "ASC",
					preferFavorites: false,
					args: undefined,
				},

				setLocale: (locale: Locale) =>
					set(state => {
						state.i18n.locale = locale;
					}),

				sessionRequested: () =>
					set(state => {
						state.session.status = "loading";
						state.session.error = undefined;
					}),

				sessionSucceeded: (isActive: boolean) => {
					set(state => {
						state.session.status = "ready";
						state.session.isActive = isActive;
					});
				},
				sessionCleared: () =>
					set(state => {
						const initialState = useGlobalStore.getInitialState();
						state.i18n = initialState.i18n;
						state.session = initialState.session;
						state.preferences = initialState.preferences;
						state.providers = initialState.providers;
						state.dialogs = initialState.dialogs;
						// TODO: not sure if we want to reset app state on logout?
						state.app = initialState.app;
					}),

				sessionFailed: (err: unknown) =>
					set(state => {
						if (isTauriError(err)) {
							if (err.code === "errors.session.invalid") {
								state.session.isActive = false;
								state.session.error = undefined;
								state.session.status = "ready";
							} else {
								state.session.status = "error";
								state.session.error = err;
							}
						}
					}),

				settingsRequested: () =>
					set(state => {
						state.settings.status = "loading";
						state.settings.error = undefined;
					}),

				settingsSucceeded: (partial?: { onboarded?: boolean }) =>
					set(state => {
						state.settings.status = "ready";
						state.settings = {
							...state.settings,
							...partial,
						};
					}),

				settingsFailed: (err: unknown) =>
					set(state => {
						state.settings.status = "error";
						if (isTauriError(err)) {
							state.settings.error = err;
						}
					}),

				preferencesRequested: () =>
					set(state => {
						state.preferences.status = "loading";
						state.preferences.error = undefined;
					}),

				preferencesSucceeded: (prefs?: { country?: Country; language?: Locale }) =>
					set(state => {
						state.preferences.status = "ready";
						if (prefs?.country !== undefined) {
							state.preferences.country = prefs.country;
						}
						if (prefs?.language !== undefined) {
							state.preferences.language = prefs.language;
							state.i18n.locale = prefs.language;
						}
					}),

				preferencesFailed: (err: unknown) =>
					set(state => {
						state.preferences.status = "error";
						if (isTauriError(err)) {
							state.preferences.error = err;
						}
					}),

				setAppVersion: (version: string, nightly: boolean) =>
					set(state => {
						state.app.version = version;
						state.app.nightly = nightly;
					}),

				updaterProgress: (progress: UpdateProgress) =>
					set(state => {
						state.updater.progress = progress;
					}),

				updaterSucceeded: (update?: Update) =>
					set(state => {
						state.updater.progress = undefined;
						state.updater.lastChecked = new Date();
						state.updater.availableUpdate = update;
						state.updater.error = undefined;
					}),

				updaterFailed: (err: unknown) =>
					set(state => {
						state.updater.availableUpdate = undefined;
						state.updater.progress = undefined;
						state.updater.lastChecked = new Date();
						if (isTauriError(err)) {
							state.updater.error = err;
						}
					}),

				providersRequested: () =>
					set(state => {
						state.providers.status = "loading";
						state.providers.error = undefined;
					}),

				providersSucceeded: (list: Provider[]) =>
					set(state => {
						state.providers.status = "ready";
						state.providers.providers = list;
						state.providers.haveFavorites = list.some(p => p.favorite);
					}),

				providersFailed: (err: unknown) =>
					set(state => {
						state.providers.status = "error";
						if (isTauriError(err)) {
							state.providers.error = err;
						}
					}),

				openMedia: (slug?: string) =>
					set(state => {
						state.dialogs.media.slug = slug;
						state.dialogs.media.isOpen = !!slug;
					}),

				closeMedia: () =>
					set(state => {
						state.dialogs.media.isOpen = false;
						state.dialogs.media.slug = undefined;
					}),

				togglePreferences: () =>
					set(state => {
						state.dialogs.preferences.isOpen = !state.dialogs.preferences.isOpen;
					}),

				toggleWatchPreferences: () =>
					set(state => {
						state.dialogs.watchPreferences.isOpen = !state.dialogs.watchPreferences.isOpen;
					}),

				browseUpdate: (input: BrowseUpdateInput) =>
					set(state => {
						if (input.query !== undefined) {
							state.browse.query = input.query;
						}
						if (input.args !== undefined) {
							state.browse.args = input.args;
						}
						if (input.sortKey !== undefined) {
							state.browse.sortKey = input.sortKey;
						}
						if (input.sortOrder !== undefined) {
							state.browse.sortOrder = input.sortOrder;
						}
						if (input.preferFavorites !== undefined) {
							state.browse.preferFavorites = input.preferFavorites;
						}
					}),

				togglePreferFavorites: () =>
					set(state => {
						state.browse.preferFavorites = !state.browse.preferFavorites;
					}),
			}))
		),
		{
			name: "Global",
			port: 8000,
			realtime: true,
		}
	)
);

export const resetGlobalStore = () => {
	const initial = useGlobalStore.getInitialState();
	useGlobalStore.setState(initial, true);
};

// all dependencies are ready
useGlobalStore.subscribe(
	state =>
		state.app.boot === "booting" &&
		state.providers.status === "ready" &&
		state.preferences.status === "ready",
	ready => {
		if (ready && useGlobalStore.getState().app.boot !== "booted") {
			useGlobalStore.setState(state => {
				state.app.boot = "booted";
			});
		}
	}
);

// we dont include providers & preferences as they are
// not required for boot, only for browsing
useGlobalStore.subscribe(
	state => state.session.status === "ready" && state.settings.status === "ready",
	ready => {
		if (ready && useGlobalStore.getState().app.boot === "cold") {
			useGlobalStore.setState(state => {
				state.app.boot = "booting";
			});
		}
	}
);

useGlobalStore.subscribe(
	state => state.i18n.locale,
	locale => {
		const direction = getLangDir(locale);
		i18next.changeLanguage(locale);

		useGlobalStore.setState(state => {
			state.i18n.direction = direction;
		});

		if (typeof document !== "undefined") {
			document.documentElement.setAttribute("dir", direction);
		}
	}
);

// FIXME: this is a bit messy, we should probably move this logic to the browse store
// or create a favorites store
// keep browse args in sync with favorites
function syncFavorites(favorites: Provider[]) {
	const {
		browse: { preferFavorites },
	} = useGlobalStore.getState();
	if (!preferFavorites) return;
	const keys = Array.from(new Set(favorites.map(p => p.key)));
	useGlobalStore.setState(state => {
		state.browse.args ||= {};
		state.browse.args.providers = keys;
	});
}

useGlobalStore.subscribe(
	state => state.providers.providers,
	providers => {
		const favorites = providers.filter(p => p.favorite);
		const currentPreferFavorites = useGlobalStore.getState().browse.preferFavorites;
		if (favorites.length === 0) {
			if (currentPreferFavorites) {
				useGlobalStore.setState(state => {
					state.browse.preferFavorites = false;
					state.providers.haveFavorites = false;
				});
			}
			return;
		}
		useGlobalStore.setState(state => {
			state.browse.preferFavorites = true;
			state.providers.haveFavorites = true;
		});
		syncFavorites(favorites);
	}
);

useGlobalStore.subscribe(
	state => state.browse.preferFavorites,
	preferFavorites => {
		if (preferFavorites) {
			const favorites = useGlobalStore.getState().providers.providers.filter(p => p.favorite);
			if (favorites.length > 0) {
				syncFavorites(favorites);
			}
		} else {
			useGlobalStore.setState(state => {
				if (state.browse.args) {
					delete state.browse.args.providers;
				}
			});
		}
	}
);
