import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.js";

export default defineConfig(configEnv =>
	mergeConfig(
		viteConfig(configEnv),
		defineConfig({
			root: "./src",
			test: {
				globals: true,
				environment: "jsdom",
				setupFiles: ["./src/test/setup.ts"],
			},
			resolve: {
				alias: {
					"@": "/",
				},
			},
		})
	)
);
