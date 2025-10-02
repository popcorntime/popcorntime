import { type Code, commands, events } from "@/tauri/types";

export interface TauriError {
	message: string;
	code: Code;
}
type Result<T> = { status: "ok"; data: T } | { status: "error"; error: TauriError };
type Unwrapped<F> = F extends (...a: infer A) => Promise<Result<infer R>>
	? (...a: A) => Promise<R>
	: F;
type API = { [K in keyof typeof commands]: Unwrapped<(typeof commands)[K]> };

function unwrapOrThrow<T>(r: Result<T>): T {
	if (r.status === "ok") return r.data;
	throw r.error;
}

export function isTauriError(e: unknown): e is TauriError {
	return !!e && typeof e === "object" && "code" in e && "message" in e;
}

function makeApi(): API {
	const src = commands;
	const out: Partial<Record<keyof typeof commands, unknown>> = {};

	for (const k in src) {
		const fn = src[k as keyof typeof src] as (...a: unknown[]) => Promise<unknown>;

		out[k as keyof typeof src] = (async (...args: unknown[]) => {
			const res = await fn(...args);

			if (res && typeof res === "object" && "status" in (res as Record<string, unknown>)) {
				return unwrapOrThrow(res as Result<unknown>);
			}
			return res;
		}) as API[keyof typeof src];
	}

	return out as API;
}

const api = makeApi();

export function useTauri() {
	return {
		api,
		on: events,
	};
}
