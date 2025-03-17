import { type InvokeArgs, invoke as invokeTauri } from "@tauri-apps/api/core";
import { type EventCallback, type EventName, listen as listenTauri } from "@tauri-apps/api/event";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Code } from "@/utils/error";
import { capitalize } from "@/utils/text";

export class TauriError extends Error {
	code!: Code;
	cause: Error | undefined;

	constructor(message: string, code: Code, cause: Error | undefined) {
		super(message);
		this.cause = cause;
		this.code = code;
	}

	static fromError(error: unknown): TauriError {
		if (error instanceof TauriError) return error;

		let code: Code = Code.Unknown;
		let message = "Unknown error";
		let cause: Error | undefined;

		if (error instanceof Error) {
			cause = error;
			message = error.message;
			if ("code" in error && error.code) {
				code = error.code as Code;
			}
		} else if (typeof error === "string") {
			message = error;
		} else if (typeof error === "object" && error !== null) {
			if ("message" in error && typeof error.message === "string") {
				message = String(error.message);
			}
			if ("code" in error) {
				code = (error.code as Code) ?? Code.Unknown;
			}
		}

		return new TauriError(capitalize(message), code, cause);
	}
}

type Options = {
	hideConsoleError?: boolean;
	hideToast?: boolean;
};

export function useTauri() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const navRef = useRef(navigate);
	const tRef = useRef(t);

	const invoke = useCallback(async <T,>(command: string, args?: InvokeArgs, opts?: Options) => {
		try {
			return await invokeTauri<T>(command, args);
		} catch (err) {
			const tauriError = TauriError.fromError(err);
			if (opts?.hideConsoleError !== true) {
				console.error(`tauri->${command}: ${JSON.stringify(args ?? {})}`, tauriError, err);
			}

			if (tauriError.code === Code.GraphqlServerError) {
				navRef.current("/maintenance");
			}

			if (!opts?.hideToast) {
				toast.error(tRef.current(tauriError.message), {
					dismissible: true,
					closeButton: true,
					duration: 5000,
				});
			}

			throw tauriError;
		}
	}, []);

	const listen = useCallback(<T,>(event: EventName, handle: EventCallback<T>) => {
		const unlistenProm = listenTauri(event, handle);
		return () => {
			unlistenProm.then(unlisten => {
				unlisten();
			});
		};
	}, []);

	return {
		invoke,
		listen,
	};
}
