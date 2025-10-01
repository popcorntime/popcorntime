import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";
import "../src/styles/globals.css";

export const decorators = [
	withThemeByDataAttribute({
		themes: {
			light: "light",
			dark: "dark",
		},
		defaultTheme: "light",
		attributeName: "data-theme",
	}),
];

const preview: Preview = {
	parameters: {
		docs: {
			story: { inline: false },
			inlineStories: false,
		},
		a11y: {
			context: "#storybook-root",
			config: {},
			options: {},
			manual: false,
			// 'todo' - show a11y violations in the test UI only
			// 'error' - fail CI on a11y violations
			// 'off' - skip a11y checks entirely
			test: "todo",
		},
	},

	tags: ["autodocs"],
};

export default preview;
