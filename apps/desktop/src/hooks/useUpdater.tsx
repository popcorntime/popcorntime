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
	const setLastChecked = useGlobalStore(state => state.updater.setLastChecked);
	const setStatus = useGlobalStore(state => state.updater.setStatus);
	const setAvailableUpdate = useGlobalStore(state => state.updater.setAvailableUpdate);
	const setProgress = useGlobalStore(state => state.updater.setProgress);
	const setVersion = useGlobalStore(state => state.app.setVersion);
	const setNightly = useGlobalStore(state => state.app.setNightly);

	const progress = useGlobalStore(state => state.updater.progress);
	const status = useGlobalStore(state => state.updater.status);
	const availableUpdate = useGlobalStore(state => state.updater.availableUpdate);
	const lastChecked = useGlobalStore(state => state.updater.lastChecked);
	const nightly = useGlobalStore(state => state.app.nightly);

	const check = useCallback(() => {
		setLastChecked(new Date());
		checkUpdate().then(update => {
			if (update?.available) {
				setStatus(UpdateStatus.Available);
			} else {
				setStatus(UpdateStatus.NoUpdate);
			}
			setAvailableUpdate(update ?? undefined);
		});
	}, [setAvailableUpdate, setLastChecked, setStatus]);

	const installUpdate = useCallback(async () => {
		if (availableUpdate) {
			setProgress(UpdateProgress.Installing);
			await availableUpdate.install();
			setProgress(UpdateProgress.Installed);
		}
	}, [availableUpdate, setProgress]);

	const downloadUpdate = useCallback(async () => {
		if (availableUpdate) {
			setProgress(UpdateProgress.Downloading);
			await availableUpdate.download((progress: DownloadEvent) => {
				setProgress(downloadStatusMap[progress.event]);
			});
			setProgress(UpdateProgress.Downloaded);
		}
	}, [availableUpdate, setProgress]);

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

		switch (status) {
			case UpdateStatus.Available:
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
	}, [status, downloadAndInstall, availableUpdate, t]);

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
		getName().then(name => {
			setNightly(name.toLowerCase().includes("nightly"));
		});

		getVersion().then(version => {
			let suffix = "";
			if (import.meta.env.DEV) {
				suffix = "-dev";
			} else if (nightly) {
				suffix = "-nightly";
			}
			setVersion(`${version}${suffix}`);
		});
	}, [nightly, setVersion, setNightly]);

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
