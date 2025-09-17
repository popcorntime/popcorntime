import { createContext, type ReactNode, useEffect } from "react";
import { useTauri } from "@/hooks/useTauri";
import { type Settings, useGlobalStore } from "@/stores/global";

const SettingsContext = createContext(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
	const setSettings = useGlobalStore(state => state.settings.setSettings);
	const isActive = useGlobalStore(state => state.session.isActive);
	const { invoke } = useTauri();

	useEffect(() => {
		if (!isActive) {
			invoke<Settings>("settings", undefined).then(setSettings);
		}
	}, [invoke, setSettings, isActive]);

	return <SettingsContext.Provider value={undefined}>{children}</SettingsContext.Provider>;
};
