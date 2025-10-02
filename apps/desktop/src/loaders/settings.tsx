import { useEffect } from "react";
import { useTauri } from "@/hooks/useTauri";
import { useGlobalStore } from "@/stores/global";

export function SettingsLoaderMount() {
	const { api } = useTauri();
	const status = useGlobalStore(s => s.settings.status);

	useEffect(() => {
		if (status !== "idle") return;

		const { settingsRequested, settingsSucceeded, settingsFailed } = useGlobalStore.getState();
		settingsRequested();
		api
			.settings()
			.then(settings => settingsSucceeded(settings))
			.catch(settingsFailed);
	}, [api, status]);

	return null;
}
