import { type Locale, locales } from "@popcorntime/i18n/types";
import { resolveResource } from "@tauri-apps/api/path";
import { readTextFile } from "@tauri-apps/plugin-fs";
import i18n from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";

async function loader(language: Locale) {
	if (!locales.includes(language)) {
		return;
	}
	const file_path = await resolveResource(`dictionaries/${language}.json`);
	const resources = await readTextFile(file_path);
	return JSON.parse(resources);
}

export function initReactI18n() {
	return i18n
		.use(resourcesToBackend(loader))
		.use(initReactI18next)
		.init({
			debug: false,
			fallbackLng: "en",
			interpolation: {
				// not needed for react as it escapes by default
				escapeValue: false,
			},
		});
}
