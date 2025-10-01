import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from "@storybook/react-vite";
import { beforeEach } from "vitest";
import * as projectAnnotations from "./preview";

beforeEach(() => {
	let root = document.getElementById("storybook-root");
	if (!root) {
		root = document.createElement("div");
		root.id = "storybook-root";
		document.body.appendChild(root);
	}
});

setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);
