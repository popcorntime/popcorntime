import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@popcorntime/ui": path.resolve(__dirname, "src"),
		},
	},
	plugins: [tailwindcss(), react()],
});
