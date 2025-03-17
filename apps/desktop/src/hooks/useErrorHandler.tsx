import { error as errorTauri } from "@tauri-apps/plugin-log";
import { useEffect } from "react";

export function useErrorHandler() {
	useEffect(() => {
		const logError = (error: unknown) => {
			try {
				errorTauri(String(error));
			} catch (err) {
				console.error("Error while trying to log error.", err);
			}
		};

		const handleWindowError = (
			event: Event | string,
			_source?: string,
			_lineno?: number,
			_colno?: number,
			error?: Error
		) => {
			logError(error || event);
		};

		const handlePromiseRejection = (event: PromiseRejectionEvent) => {
			logError(event.reason);
		};

		window.onerror = handleWindowError;
		window.onunhandledrejection = handlePromiseRejection;

		return () => {
			window.onerror = null;
			window.onunhandledrejection = null;
		};
	}, []);
}
