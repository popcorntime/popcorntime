import { type Country, i18n } from "@popcorntime/i18n";
import { createContext, type ReactNode, useContext, useMemo } from "react";
import { useSearchParams } from "react-router";
import { useGlobalStore } from "@/stores/global";

export type Context = {
	country: Country;
};

const CountryContext = createContext<Context>({
	country: i18n.defaultCountry,
});

export const CountryProvider = ({ children }: { children: ReactNode }) => {
	const preferedCountry = useGlobalStore(state => state.preferences?.country);
	const [searchParams, _] = useSearchParams();

	const country = useMemo(() => {
		return (searchParams.get("country")?.toUpperCase() ??
			preferedCountry?.toUpperCase() ??
			i18n.defaultCountry.toUpperCase()) as Country;
	}, [searchParams, preferedCountry]);

	return (
		<CountryContext.Provider
			value={{
				country,
			}}
		>
			{children}
		</CountryContext.Provider>
	);
};

export const useCountry = () => {
	return useContext(CountryContext);
};
