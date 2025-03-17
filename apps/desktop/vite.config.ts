import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));
export default defineConfig(async () => ({
	plugins: [tailwindcss(), react()],
	clearScreen: false,

	build: {
		rollupOptions: {
			output: { manualChunks: {} },
			target: "modules",
			minify: !process.env.TAURI_ENV_DEBUG ? "esbuild" : false,
		},
	},

	server: {
		port: 1420,
		strictPort: true,
		fs: {
			strict: false,
		},
	},
	envPrefix: ["VITE_", "TAURI_"],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
}));
