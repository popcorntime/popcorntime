import "@testing-library/jest-dom";
import i18n from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";
import { pluginShellOpen, toast } from "@/test/mock";
import { Code } from "@/utils/error";

const dicts = import.meta.glob("../../crates/popcorntime-tauri/dictionaries/*.json", {
	eager: true,
	import: "default",
}) as Record<string, Record<string, unknown>>;

i18n
	.use(
		resourcesToBackend((lng: string) => {
			const key = Object.keys(dicts).find(p => p.endsWith(`${lng}.json`));
			return key ? dicts[key] : {};
		})
	)
	.use(initReactI18next)
	.init({
		debug: false,
		fallbackLng: "en",
		interpolation: {
			escapeValue: false,
		},
	});

vi.mock("sonner", () => ({ toast }));
vi.mock("zustand");

vi.mock("@tauri-apps/plugin-shell", async () => {
	const actual = await vi.importActual("@tauri-apps/plugin-shell");
	return {
		...actual,
		open: pluginShellOpen,
	};
});

process.on("unhandledRejection", err => {
	if ((err as { code?: string })?.code === Code.InvalidSession) return;
	throw err;
});
