import type { Country, Locale } from "@popcorntime/i18n/types";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";
import { useProviders } from "@/hooks/useProviders";
import { isTauriError, useTauri } from "@/hooks/useTauri";
import { useGlobalStore } from "@/stores/global";
import type { UpdatePreferencesInput } from "@/tauri/types";

const PUBLIC_ROUTES = [/^\/$/, /^\/login$/, /^\/onboarding(\/.*)?$/];

function isPublicRoute(pathname: string) {
	return PUBLIC_ROUTES.some(rx => rx.test(pathname));
}

type Context = {
	logout: () => Promise<void>;
	updatePreferences: (params: UpdatePreferencesInput) => Promise<void>;
};
const SessionContext = createContext<Context>({
	logout: async () => {},
	updatePreferences: async () => {},
});

export const SessionProvider = ({ children }: { children: ReactNode }) => {
	const { getProviders } = useProviders();
	const { t } = useTranslation();
	const setSessionInitialized = useGlobalStore(state => state.session.setInitialized);
	const setPreferencesInitialized = useGlobalStore(state => state.preferences.setInitialized);
	const setLoading = useGlobalStore(state => state.session.setIsLoading);
	const setActive = useGlobalStore(state => state.session.setIsActive);
	const { country } = useGlobalStore(useShallow(state => state.preferences));
	const setPreferences = useGlobalStore(state => state.preferences.setPreferences);
	const isActive = useGlobalStore(state => state.session.isActive);

	const { api, on } = useTauri();
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const navigateRef = useRef(navigate);
	const pathRef = useRef(pathname);

	useEffect(() => {
		pathRef.current = pathname;
	}, [pathname]);

	const revalidate = useCallback(async () => {
		setLoading(true);
		try {
			await api.validate();
			setActive(true);
		} catch (e) {
			setActive(false);
			if (isTauriError(e) && e.code === "errors.session.invalid") {
				if (!isPublicRoute(pathRef.current)) {
					navigateRef.current("/login", { replace: true });
				}
			} else {
				throw e;
			}
		} finally {
			setLoading(false);
			setSessionInitialized();
		}
	}, [api.validate, setActive, setLoading, setSessionInitialized]);

	const logout = useCallback(async () => {
		try {
			await api.logout();
		} catch (e) {
			console.error(e);
		} finally {
			setActive(false);
			if (pathRef.current !== "/login") navigate("/login", { replace: true });
		}
	}, [api.logout, navigate, setActive]);

	useEffect(() => {
		let disposed = false;
		let unlisten: (() => void) | undefined;

		(async () => {
			const fn = await on.sessionUpdate.listen(() => {
				try {
					if (disposed) return;
					void revalidate();
				} catch (error) {
					console.error("Failed to revalidate session after update", error);
				}
			});
			if (disposed) {
				fn();
				return;
			}
			unlisten = fn;
		})();

		return () => {
			disposed = true;
			if (unlisten) unlisten();
		};
	}, [on.sessionUpdate, revalidate]);

	useEffect(() => {
		try {
			void revalidate();
		} catch (error) {
			console.error("Failed to revalidate session", error);
		}
	}, [revalidate]);

	useEffect(() => {
		if (!isActive) {
			return;
		}

		api
			.userPreferences()
			.then(prefs => {
				// FIXME: inject Country and Locale into specta
				const country = prefs?.preferences?.country as Country | undefined;
				const language = prefs?.preferences?.language as Locale | undefined;
				if (country && language) {
					setPreferences({ country, language });
				}
			})
			// fallback to default preferences on error
			.catch(console.error)
			.finally(setPreferencesInitialized);
	}, [isActive, api.userPreferences, setPreferences, setPreferencesInitialized]);

	useEffect(() => {
		if (!isActive || !country) {
			return;
		}
		getProviders(country);
	}, [isActive, country, getProviders]);

	const updatePreferences = useCallback(
		async (params: UpdatePreferencesInput) => {
			try {
				const prefs = await api.updateUserPreferences(params);
				if (prefs) {
					// FIXME: inject Country and Locale into specta
					const country = prefs?.updatePreferences?.country as Country | undefined;
					const language = prefs?.updatePreferences?.language as Locale | undefined;
					if (country && language) {
						setPreferences({ country, language });
					}
				}
			} catch (err) {
				toast.error(t("preferences.error"), {
					dismissible: true,
					closeButton: true,
					duration: 5000,
				});
				console.error(err);
			}
		},
		[api.updateUserPreferences, setPreferences, t]
	);

	return (
		<SessionContext.Provider value={{ logout, updatePreferences }}>
			{children}
		</SessionContext.Provider>
	);
};

export const useSession = () => {
	return useContext(SessionContext);
};
