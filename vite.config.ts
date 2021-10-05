import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { readdirSync } from "fs";

const manifestIcons = [
  ...[192, 512].map((size) => ({
    src: `icons/pwa_icon_x${size}.png`,
    sizes: `${size}x${size}`,
    type: "image/png",
  })),
  ...[48, 96, 128, 192, 384, 512].map((size) => ({
    src: `icons/maskable_icon_x${size}.png`,
    sizes: `${size}x${size}`,
    type: "image/png",
    purpose: "maskable",
  })),
];

const staticAssets = [
  "robots.txt",
  ...readdirSync("public/icons")
    .filter((file) =>
      [".svg", ".png", ".xml", ".ico"].some((ext) => file.endsWith(ext))
    )
    .map((file) => `icons/${file}`),
];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      includeAssets: staticAssets,
      manifest: {
        name: "Scribbit",
        description: "Pre-flight verifier for The Student",
        theme_color: "#2563EB",
        start_url: "/",
        icons: manifestIcons,
      },
    }),
  ],
  build: { sourcemap: true },
});
