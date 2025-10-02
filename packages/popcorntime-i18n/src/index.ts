import {
	type Country,
	type CountryPath,
	countries,
	type DefaultLocaleTag,
	i18n,
	type Locale,
	type LocaleTag,
} from "./types.js";

export { i18n, locales } from "./types.js";
export type { Locale, Country, DefaultLocaleTag, LocaleTag, CountryPath };
export { countries };

export function getCountryLocale(country: Country): Locale {
	return i18n.raw[country].default;
}

export function isDefaultLocale(country: Country, userLocale: Locale) {
	return getCountryLocale(country) === userLocale;
}

export function getLocalesForCountry(country: Country) {
	return i18n.raw[country].languages;
}
