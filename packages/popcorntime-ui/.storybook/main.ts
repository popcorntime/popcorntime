 import type { StorybookConfig } from '@storybook/react-vite';
import { join, dirname } from "path"

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')))
}
const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],

  "addons": [
    getAbsolutePath("@storybook/addon-themes"),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath("@storybook/addon-docs")
  ],

  "framework": {
    "name": getAbsolutePath('@storybook/react-vite'),
    "options": {}
  },

  "typescript": {
    "check": true
  }
};
export default config;