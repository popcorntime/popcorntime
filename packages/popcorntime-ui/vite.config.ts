import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@popcorntime/ui": path.resolve(__dirname, "src"),
    },
  },
  plugins: [tailwindcss(), react()],
});
