import {
	type ProviderSearchForCountry,
	type SearchArguments,
	SortKey,
} from "@popcorntime/graphql/types";
import { i18n } from "@popcorntime/i18n";
import type { Country, Locale } from "@popcorntime/i18n/types";
import type { Update } from "@tauri-apps/plugin-updater";
import i18next from "i18next";
import { getLangDir } from "rtl-detect";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { devtools } from "@/stores/devtools";

type UpdateStatus = "available" | "manual" | "no-update";
type UpdateProgress = "downloading" | "downloaded" | "installing" | "installed";

export interface GlobalState {
	i18n: {
		/** Application locale */
		locale: Locale;
		direction: "ltr" | "rtl";
		/**
		 * Update application locale
		 * @param locale Locale
		 */
		setLocale: (locale: Locale) => void;
	};
	session: {
		/** Session initialized */
		initialized: boolean;
		setInitialized: () => void;

		/** Session active */
		isActive: boolean;
		setIsActive: (isActive: boolean) => void;
		/** Session is currenly validating */
		isLoading: boolean;
		setIsLoading: (isLoading: boolean) => void;
	};
	preferences: {
		/** Preferences initialized */
		initialized: boolean;
		setInitialized: () => void;
		country?: Country;
		language?: Locale;
		setPreferences: (preferences?: { country: Country; language: Locale }) => void;
	};
	settings: {
		/** Session initialized */
		initialized: boolean;

		/** Whether onboarding flow has been completed */
		onboarded: boolean;
		setOnboarded: (onboarded: boolean) => void;
	};
	app: {
		/** Application is ready and browsing can start */
		initialized: boolean;
		/** Depedency are ready */
		bootInitialized: boolean;
		/** Current application version */
		version: string | undefined;
		setVersion: (version: string) => void;
		/** Determine if we are running nightly version */
		nightly: boolean;
		setNightly: (nightly: boolean) => void;
	};
	updater: {
		status: UpdateStatus;
		setStatus: (status: UpdateStatus) => void;
		progress?: UpdateProgress;
		setProgress: (progress?: UpdateProgress) => void;
		availableUpdate?: Update;
		setAvailableUpdate: (update?: Update) => void;
		lastChecked?: Date;
		setLastChecked: (date?: Date) => void;
	};
	providers: {
		initialized: boolean;
		setInitialized: () => void;
		isLoading: boolean;
		setIsLoading: (isLoading: boolean) => void;
		providers: ProviderSearchForCountry[];
		setProviders: (providers: ProviderSearchForCountry[]) => void;
		favorites: ProviderSearchForCountry[];
		setFavorites: (favorites: ProviderSearchForCountry[]) => void;
	};
	browse: {
		/** Search query */
		query?: string;
		setQuery: (query?: string) => void;
		/** Current browsing cursor */
		cursor?: string;
		setCursor: (cursor?: string) => void;
		/** Current browsing args */
		args?: SearchArguments;
		setArgs: (args?: SearchArguments) => void;
		/** Current browsing sort key */
		sortKey: SortKey;
		setSortKey: (sortKey: SortKey) => void;
		/** Whether to show only favorite providers content */
		preferFavorites: boolean;
		togglePreferFavorites: () => void;
	};
	dialogs: {
		media: {
			/** Slug the dialog should load */
			slug?: string;
			open: (slug?: string) => void;
			/** Dialog is open */
			isOpen: boolean;
			toggle: () => void;
		};
		preferences: {
			/** Dialog is open */
			isOpen: boolean;
			toggle: () => void;
		};
		watchPreferences: {
			/** Dialog is open */
			isOpen: boolean;
			toggle: () => void;
		};
	};
}

export const useGlobalStore = create<GlobalState>()(
	devtools(
		subscribeWithSelector(
			immer(set => ({
				i18n: {
					locale: i18n.defaultLocale,
					direction: getLangDir(i18n.defaultLocale),
					setLocale: (locale: Locale) =>
						set(state => {
							state.i18n.locale = locale;
						}),
				},
				session: {
					initialized: false,
					isActive: false,
					isLoading: false,
					setInitialized: () =>
						set(state => {
							state.session.initialized = true;
						}),
					setIsActive: (isActive: boolean) =>
						set(state => {
							state.session.isActive = isActive;
						}),
					setIsLoading: (isLoading: boolean) =>
						set(state => {
							state.session.isLoading = isLoading;
						}),
				},
				settings: {
					initialized: false,
					onboarded: false,
					setOnboarded: (onboarded: boolean) =>
						set(state => {
							state.settings.onboarded = onboarded;
							state.settings.initialized = true;
						}),
				},
				preferences: {
					initialized: false,
					setInitialized: () =>
						set(state => {
							state.preferences.initialized = true;
						}),
					setPreferences: preferences =>
						set(state => {
							// FIXME: would worth moving into a subscription?
							if (preferences?.language) {
								state.i18n.locale = preferences.language;
							}
							state.preferences.country = preferences?.country;
							state.preferences.language = preferences?.language;
							state.dialogs.preferences.isOpen = false;
						}),
				},
				app: {
					initialized: false,
					bootInitialized: false,
					version: undefined,
					setVersion: (version: string) =>
						set(state => {
							state.app.version = version;
						}),
					nightly: false,
					setNightly: (nightly: boolean) =>
						set(state => {
							state.app.nightly = nightly;
						}),
				},
				updater: {
					status: "no-update",
					setStatus: (status: UpdateStatus) =>
						set(state => {
							state.updater.status = status;
						}),
					setProgress: (progress?: UpdateProgress) =>
						set(state => {
							state.updater.progress = progress;
						}),
					setAvailableUpdate: (update?: Update) =>
						set(state => {
							state.updater.availableUpdate = update;
						}),
					setLastChecked: (date?: Date) =>
						set(state => {
							state.updater.lastChecked = date;
						}),
				},
				providers: {
					initialized: false,
					isLoading: false,
					providers: [],
					favorites: [],
					setInitialized: () =>
						set(state => {
							state.providers.initialized = true;
						}),
					setIsLoading: (isLoading: boolean) =>
						set(state => {
							state.providers.isLoading = isLoading;
						}),
					setProviders: (providers: ProviderSearchForCountry[]) =>
						set(state => {
							state.providers.providers = providers;
						}),
					setFavorites: (favorites: ProviderSearchForCountry[]) =>
						set(state => {
							state.providers.favorites = favorites;
						}),
				},
				browse: {
					query: undefined,
					cursor: undefined,
					args: undefined,
					sortKey: SortKey.POSITION,
					preferFavorites: true,
					setQuery: (query?: string) =>
						set(state => {
							state.browse.query = query;
						}),
					setCursor: (cursor?: string) =>
						set(state => {
							state.browse.cursor = cursor;
						}),
					setArgs: (args?: SearchArguments) =>
						set(state => {
							state.browse.args = args;
						}),
					setSortKey: (sortKey: SortKey) =>
						set(state => {
							state.browse.sortKey = sortKey;
						}),
					togglePreferFavorites: () =>
						set(state => {
							state.browse.preferFavorites = !state.browse.preferFavorites;
						}),
				},
				dialogs: {
					media: {
						slug: undefined,
						isOpen: false,
						open: (slug?: string) =>
							set(state => {
								state.dialogs.media.isOpen = true;
								state.dialogs.media.slug = slug;
							}),
						toggle: () =>
							set(state => {
								state.dialogs.media.slug = undefined;
								state.dialogs.media.isOpen = !state.dialogs.media.isOpen;
							}),
					},
					preferences: {
						isOpen: false,
						toggle: () =>
							set(state => {
								if (
									state.dialogs.preferences.isOpen &&
									state.preferences.initialized &&
									state.preferences.country === undefined &&
									state.preferences.language === undefined
								) {
									// prevent closing preferences if not set
									return;
								}
								state.dialogs.preferences.isOpen = !state.dialogs.preferences.isOpen;
							}),
					},
					watchPreferences: {
						isOpen: false,
						toggle: () =>
							set(state => {
								state.dialogs.watchPreferences.isOpen = !state.dialogs.watchPreferences.isOpen;
							}),
					},
				},
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

function syncFavorites(favorites: ProviderSearchForCountry[]) {
	const {
		providers,
		browse: { preferFavorites },
	} = useGlobalStore.getState();
	if (!providers.initialized) return;
	if (!preferFavorites) return;
	const keys = Array.from(new Set(favorites.map(p => p.key)));
	useGlobalStore.setState(state => {
		state.browse.args ||= {};
		state.browse.args.providers = keys;
	});
}

// i18n can be updated by preferences update as well
// we keep it as a subscription to avoid circular updates
useGlobalStore.subscribe(
	state => state.i18n.locale,
	locale => {
		i18next.changeLanguage(locale);
		const dir = getLangDir(locale);
		if (typeof document !== "undefined") {
			document.documentElement.setAttribute("dir", dir);
		}
		useGlobalStore.setState(state => {
			state.i18n.direction = dir;
		});
	}
);

useGlobalStore.subscribe(
	state => state.providers.favorites,
	favorites => syncFavorites(favorites)
);

useGlobalStore.subscribe(
	state => state.browse.preferFavorites,
	preferFavorites => {
		if (preferFavorites) {
			syncFavorites(useGlobalStore.getState().providers.favorites);
		} else {
			useGlobalStore.setState(state => {
				if (!state.browse.args) return;
				delete state.browse.args.providers;
			});
		}
	}
);

// all dependencies are ready
useGlobalStore.subscribe(
	state =>
		state.providers.initialized &&
		state.session.initialized &&
		state.preferences.initialized &&
		state.settings.initialized,
	ready => {
		if (ready && !useGlobalStore.getState().app.initialized) {
			useGlobalStore.setState(state => {
				state.app.initialized = true;
			});
		}
	},
	{ equalityFn: Object.is }
);

// we dont include providers & preferences as they are
// not required for boot, only for browsing
useGlobalStore.subscribe(
	state => state.session.initialized && state.settings.initialized,
	ready => {
		if (ready && !useGlobalStore.getState().app.bootInitialized) {
			useGlobalStore.setState(state => {
				state.app.bootInitialized = true;
			});
		}
	},
	{ equalityFn: Object.is }
);

useGlobalStore.subscribe(
	state => state.session.isActive,
	isActive => {
		if (!isActive) {
			// reset initial state on logout
			// we could have a more elegant way to do that
			resetGlobalStore();
		}
	}
);

// FIXME: should we open?
useGlobalStore.subscribe(
	state =>
		state.app.bootInitialized &&
		state.session.isActive &&
		state.settings.onboarded &&
		state.preferences.initialized &&
		(!state.preferences.country || !state.preferences.language) &&
		!state.dialogs.preferences.isOpen,
	ready => {
		if (!ready) return;
		useGlobalStore.setState(state => {
			state.dialogs.preferences.isOpen = true;
		});
	},
	{ equalityFn: Object.is }
);
