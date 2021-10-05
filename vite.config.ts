import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      includeAssets: ["robots.txt"],
      manifest: {
        name: "Scribbit",
        description: "Pre-flight verifier for The Student",
        theme_color: "#2563EB",
        start_url: "/",
      },
    }),
  ],
  build: { sourcemap: true },
});
