import { getName, getVersion } from "@tauri-apps/api/app";
import { relaunch } from "@tauri-apps/plugin-process";
import { check as checkUpdate, type DownloadEvent } from "@tauri-apps/plugin-updater";
import { createContext, useCallback, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useGlobalStore } from "@/stores/global";

// 1 hour
const UPDATE_INTERVAL_MS = 3600000;
export enum UpdateStatus {
	Available = "available",
	Manual = "manual",
	NoUpdate = "no-update",
}

export enum UpdateProgress {
	Downloading = "downloading",
	Downloaded = "downloaded",
	Installing = "installing",
	Installed = "installed",
}

const downloadStatusMap: { [K in DownloadEvent["event"]]: UpdateProgress } = {
	Started: UpdateProgress.Downloading,
	Progress: UpdateProgress.Downloading,
	Finished: UpdateProgress.Downloaded,
};

export type Context = {
	check: () => void;
	downloadAndInstall: () => void;
	relaunch: () => void;
	hide: (hide: boolean) => boolean;
};

const UpdaterContext = createContext<Context>({
	check: () => {},
	downloadAndInstall: () => {},
	hide: () => false,
	relaunch: () => undefined,
});

export const UpdaterProvider = ({ children }: React.PropsWithChildren) => {
	const { t } = useTranslation();
	const updaterSucceeded = useGlobalStore(state => state.updaterSucceeded);
	const updaterFailed = useGlobalStore(state => state.updaterFailed);
	const updaterProgress = useGlobalStore(state => state.updaterProgress);
	const setAppVersion = useGlobalStore(state => state.setAppVersion);

	const progress = useGlobalStore(state => state.updater.progress);
	const availableUpdate = useGlobalStore(state => state.updater.availableUpdate);
	const lastChecked = useGlobalStore(state => state.updater.lastChecked);
	const nightly = useGlobalStore(state => state.app.nightly);

	const check = useCallback(() => {
		checkUpdate()
			.then(update => {
				updaterSucceeded(update ?? undefined);
			})
			.catch(updaterFailed);
	}, [updaterSucceeded, updaterFailed]);

	const installUpdate = useCallback(async () => {
		if (availableUpdate) {
			updaterProgress(UpdateProgress.Installing);
			await availableUpdate.install();
			updaterProgress(UpdateProgress.Installed);
		}
	}, [availableUpdate, updaterProgress]);

	const downloadUpdate = useCallback(async () => {
		if (availableUpdate) {
			updaterProgress(UpdateProgress.Downloading);
			await availableUpdate.download((progress: DownloadEvent) => {
				updaterProgress(downloadStatusMap[progress.event]);
			});
			updaterProgress(UpdateProgress.Downloaded);
		}
	}, [availableUpdate, updaterProgress]);

	const downloadAndInstall = useCallback(() => {
		if (availableUpdate) {
			downloadUpdate()
				.then(installUpdate)
				.catch(error => {
					console.error(error);
					toast.error(t("update.error"));
				});
		}
	}, [downloadUpdate, installUpdate, t, availableUpdate]);

	const hide = useCallback(
		(hide: boolean) => {
			if (availableUpdate && hide) {
				toast.dismiss(`update-available-${availableUpdate?.version}`);
			} else if (availableUpdate && !hide) {
				toast(t("update.available", { version: availableUpdate?.version }), {
					id: `update-available-${availableUpdate?.version}`,
					closeButton: import.meta.env.DEV,
					dismissible: import.meta.env.DEV,
					duration: Infinity,
					action: {
						label: t("update.install"),
						onClick: () => {
							toast.dismiss(`update-available-${availableUpdate?.version}`);
							downloadAndInstall();
						},
					},
				});
			}

			return availableUpdate !== undefined;
		},
		[downloadAndInstall, availableUpdate, t]
	);

	useEffect(() => {
		if (!lastChecked || Date.now() - lastChecked.getTime() > UPDATE_INTERVAL_MS) {
			check();
		}
	}, [lastChecked, check]);

	useEffect(() => {
		const interval = setInterval(() => {
			check();
		}, UPDATE_INTERVAL_MS);
		return () => clearInterval(interval);
	}, [check]);

	useEffect(() => {
		if (!availableUpdate) {
			return;
		}

		toast(t("update.available", { version: availableUpdate?.version }), {
			id: `update-available-${availableUpdate?.version}`,
			closeButton: import.meta.env.DEV,
			dismissible: import.meta.env.DEV,
			duration: Infinity,
			action: {
				label: t("update.install"),
				onClick: () => {
					toast.dismiss(`update-available-${availableUpdate?.version}`);
					downloadAndInstall();
				},
			},
		});
	}, [downloadAndInstall, availableUpdate, t]);

	useEffect(() => {
		switch (progress) {
			case UpdateProgress.Downloading:
				toast.loading(t("update.downloading"), {
					id: `update-progress-${availableUpdate?.version}`,
				});
				break;
			case UpdateProgress.Downloaded:
				toast.loading(t("update.downloaded"), {
					id: `update-progress-${availableUpdate?.version}`,
				});
				break;
			case UpdateProgress.Installing:
				toast.loading(t("update.installing"), {
					id: `update-progress-${availableUpdate?.version}`,
				});
				break;
			case UpdateProgress.Installed:
				toast.dismiss(`update-progress-${availableUpdate?.version}`);
				toast(t("update.installed"), {
					id: `update-complete-${availableUpdate?.version}`,
					dismissible: false,
					duration: Infinity,
					action: {
						label: t("update.relaunch"),
						onClick: relaunch,
					},
				});
				break;
		}
	}, [progress, t, availableUpdate?.version]);

	useEffect(() => {
		Promise.all([getName(), getVersion()]).then(([appName, version]) => {
			const isNightly = appName.toLowerCase().includes("nightly");
			setAppVersion(version, isNightly);
		});
	}, [nightly, setAppVersion]);

	return (
		<UpdaterContext.Provider
			value={{
				hide,
				check,
				downloadAndInstall,
				relaunch,
			}}
		>
			{children}
		</UpdaterContext.Provider>
	);
};

export const useUpdater = () => {
	return useContext(UpdaterContext);
};
