import { useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import { type Code, commands, events } from "@/tauri/types";

type TauriError = { message: string; code: Code };
type Result<T> = { status: "ok"; data: T } | { status: "error"; error: TauriError };
type Unwrapped<F> = F extends (...a: infer A) => Promise<Result<infer R>>
	? (...a: A) => Promise<R>
	: F;
type API = { [K in keyof typeof commands]: Unwrapped<(typeof commands)[K]> };

function unwrapOrThrow<T>(r: Result<T>, onSessionInvalid: () => void): T {
	if (r.status === "ok") return r.data;
	if (r.error.code === "errors.session.invalid") onSessionInvalid();
	throw r.error;
}

export function isTauriError(e: unknown): e is TauriError {
	return !!e && typeof e === "object" && "code" in e && "message" in e;
}

export function makeApi(onSessionInvalid: () => void): API {
	const src = commands;
	const out: Partial<Record<keyof typeof commands, unknown>> = {};

	for (const k in src) {
		const fn = src[k as keyof typeof src] as (...a: unknown[]) => Promise<unknown>;

		out[k as keyof typeof src] = (async (...args: unknown[]) => {
			const res = await fn(...args);

			if (res && typeof res === "object" && "status" in (res as Record<string, unknown>)) {
				return unwrapOrThrow(res as Result<unknown>, onSessionInvalid);
			}
			return res;
		}) as API[keyof typeof src];
	}

	return out as API;
}

export function useTauri() {
	const navigate = useNavigate();
	const navigateRef = useRef(navigate);

	const api = useMemo(
		() =>
			makeApi(() => {
				// if session is invalid always restart from home
				// it might be changed later to a more complex logic
				navigateRef.current("/");
			}),
		[]
	);

	return {
		api,
		on: events,
	};
}
