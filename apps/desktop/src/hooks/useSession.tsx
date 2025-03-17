import type { UserPreferences } from "@popcorntime/graphql/types";
import type { Country, Locale } from "@popcorntime/i18n";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";
import { useProviders } from "@/hooks/useProviders";
import { type TauriError, useTauri } from "@/hooks/useTauri";
import { useGlobalStore } from "@/stores/global";
import { Code } from "@/utils/error";

type UpdatePreferencesParams = {
	country: Country;
	language: Locale;
};

const PUBLIC_ROUTES = [/^\/$/, /^\/login$/, /^\/onboarding(\/.*)?$/];

function isPublicRoute(pathname: string) {
	return PUBLIC_ROUTES.some(rx => rx.test(pathname));
}

type Context = {
	logout: () => Promise<void>;
	revalidate: () => Promise<void>;
	updatePreferences: (params: UpdatePreferencesParams) => Promise<void>;
};
const SessionContext = createContext<Context>({
	logout: async () => {},
	revalidate: async () => {},
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

	const { invoke, listen } = useTauri();
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
			await invoke("validate", undefined, {
				hideConsoleError: true,
				hideToast: true,
			});
			setActive(true);
		} catch (e) {
			const err = e as TauriError;
			setActive(false);
			if (err.code === Code.InvalidSession && !isPublicRoute(pathRef.current)) {
				navigateRef.current("/login", { replace: true });
			} else {
				throw err;
			}
		} finally {
			setLoading(false);
			setSessionInitialized();
		}
	}, [invoke, setActive, setLoading, setSessionInitialized]);

	const logout = useCallback(async () => {
		await invoke("logout", undefined, { hideConsoleError: true });
		setActive(false);
		if (pathRef.current !== "/login") navigate("/", { replace: true });
	}, [invoke, navigate, setActive]);

	useEffect(() => {
		// emitted when the session might have changed
		return listen("popcorntime://session_update", () => {
			void revalidate();
		});
	}, [listen, revalidate]);

	useEffect(() => {
		void revalidate();
	}, [revalidate]);

	useEffect(() => {
		if (!isActive) {
			return;
		}

		invoke<UserPreferences | null>("user_preferences", undefined, {
			hideConsoleError: true,
			hideToast: true,
		})
			.then(prefs => {
				setPreferences(prefs ?? undefined);
			})
			// fallback to default preferences on error
			.catch(console.error)
			.finally(setPreferencesInitialized);
	}, [isActive, invoke, setPreferences, setPreferencesInitialized]);

	useEffect(() => {
		if (!isActive || !country) {
			return;
		}
		getProviders(country);
	}, [isActive, country, getProviders]);

	const updatePreferences = useCallback(
		async (params: UpdatePreferencesParams) => {
			try {
				const preferences = await invoke<Pick<UserPreferences, "country" | "language">>(
					"update_user_preferences",
					{ params }
				);
				setPreferences(preferences);
			} catch (err) {
				toast.error(t("preferences.error"), {
					dismissible: true,
					closeButton: true,
					duration: 5000,
				});
				console.error(err);
			}
		},
		[invoke, setPreferences, t]
	);

	return (
		<SessionContext.Provider value={{ logout, revalidate, updatePreferences }}>
			{children}
		</SessionContext.Provider>
	);
};

export const useSession = () => {
	return useContext(SessionContext);
};
