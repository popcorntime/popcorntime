import { useCallback, useEffect } from "react";
import { useTauri } from "@/hooks/useTauri";
import { useGlobalStore } from "@/stores/global";

export function SessionLoaderMount() {
	const { api, on } = useTauri();

	const validate = useCallback(async () => {
		const { sessionRequested, sessionSucceeded, sessionFailed } = useGlobalStore.getState();
		sessionRequested();
		api
			.validate()
			.then(() => sessionSucceeded(true))
			.catch(sessionFailed);
	}, []);

	useEffect(() => {
		void validate();
		let unlisten: (() => void) | undefined;
		on.sessionUpdate
			.listen(() => {
				void validate();
			})
			.then(fn => {
				unlisten = fn;
			})
			.catch(console.error);

		return unlisten;
	}, [validate]);

	return null;
}
