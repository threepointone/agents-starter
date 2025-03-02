import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [cloudflare(), react(), tailwindcss()],
  resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
