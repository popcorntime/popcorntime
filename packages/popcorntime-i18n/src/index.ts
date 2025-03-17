import {
  i18n,
  Locale,
  Country,
  countryVariations,
  DefaultLocaleTag,
  LocaleTag,
  CountryPath,
  countries,
} from "./types.js";
export { i18n, locales } from "./types.js";
export type { Locale, Country, DefaultLocaleTag, LocaleTag, CountryPath };
export { countries };
export type LocaleCookie = {
  locale: Locale;
  forced: boolean;
};

export function getCountryLocale(country: Country): Locale {
  return i18n.raw[country].default;
}

export function isDefaultLocale(country: Country, userLocale: Locale) {
  return getCountryLocale(country) === userLocale;
}

export function getLocalesForCountry(country: Country) {
  return i18n.raw[country].languages;
}

export function getVariationForLocale(country: Country, userLocale: Locale) {
  if (isDefaultLocale(country, userLocale)) {
    if (countryVariations[country]) {
      return countryVariations[country];
    } else {
      return 1;
    }
  } else {
    // return default variation
    return 1;
  }
}
