import { useEffect } from "react";
import { useTauri } from "@/hooks/useTauri";
import { useGlobalStore } from "@/stores/global";

export function SettingsLoaderMount() {
	const { api } = useTauri();
	const isActive = useGlobalStore(s => s.session.isActive);
	const status = useGlobalStore(s => s.settings.status);

	useEffect(() => {
		if (!isActive) return;
		if (status !== "idle") return;

		const { settingsRequested, settingsSucceeded, settingsFailed } = useGlobalStore.getState();
		settingsRequested();
		api
			.isOnboarded()
			.then(onboarded => settingsSucceeded({ onboarded }))
			.catch(settingsFailed);
	}, [api, isActive, status]);

	return null;
}
