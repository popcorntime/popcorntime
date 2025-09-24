import { createContext, type ReactNode, useEffect } from "react";
import { useTauri } from "@/hooks/useTauri";
import { useGlobalStore } from "@/stores/global";

const SettingsContext = createContext(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
	const setOnboarded = useGlobalStore(state => state.settings.setOnboarded);
	const isActive = useGlobalStore(state => state.session.isActive);
	const { api } = useTauri();

	useEffect(() => {
		if (!isActive) {
			api.isOnboarded().then(setOnboarded);
		}
	}, [api, setOnboarded, isActive]);

	return <SettingsContext.Provider value={undefined}>{children}</SettingsContext.Provider>;
};
