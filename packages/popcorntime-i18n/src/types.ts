import rawLocales from "../locales.js";
export type RawLocales = (typeof rawLocales)[keyof typeof rawLocales];
export type Country = keyof typeof rawLocales;
export type Locale = RawLocales["languages"][number];
export type Variation = 1 | 2 | 3 | 4 | 5;
export type LocaleTag = {
	[C in Country]: `${(typeof rawLocales)[C]["languages"][number]}-${Uppercase<C>}`;
}[Country];
export type DefaultLocaleTag = {
	[C in Country]: `${(typeof rawLocales)[C]["default"]}-${Uppercase<C>}`;
}[Country];
export type CountryPath = {
	[C in Country]:
		| C
		| Exclude<
				`${C}-${(typeof rawLocales)[C]["languages"][number]}`,
				`${C}-${(typeof rawLocales)[C]["default"]}`
		  >;
}[Country];

export const locales = Array.from(
	new Set(Object.values(rawLocales).flatMap(data => data.languages))
) as Locale[];

export const localeTags = Array.from(
	new Set(
		Object.entries(rawLocales).flatMap(([country, data]) =>
			data.languages.map(lang => `${lang}-${country.toUpperCase()}`)
		)
	)
) as LocaleTag[];

export const defaultLocaleTags = Array.from(
	new Set(
		Object.entries(rawLocales).flatMap(
			([country, data]) => `${data.default}-${country.toUpperCase()}`
		)
	)
) as DefaultLocaleTag[];

export const countryPaths = Array.from(
	new Set(
		Object.entries(rawLocales).flatMap(([country, data]) => [
			country,
			...data.languages.filter(lang => lang !== data.default).map(lang => `${country}-${lang}`),
		])
	)
) as CountryPath[];

export const countries = Object.keys(rawLocales) as Country[];

export const i18n = {
	defaultLocale: "en",
	defaultCountry: "US",
	locales,
	countries,
	raw: rawLocales,
	localeTags,
	defaultLocaleTags,
	countryPaths,
} as const;
