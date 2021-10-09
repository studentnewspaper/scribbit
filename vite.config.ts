import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

process.env.VITE_COMMIT = process.env.COMMIT_REF ?? undefined;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: { sourcemap: true },
});
