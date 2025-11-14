import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	base: "/site-card-prototype/",
	plugins: [
		tailwindcss(),
		react(),
	],
	server: {
		port: 5173,
	},
});
