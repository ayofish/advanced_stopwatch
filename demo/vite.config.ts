import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/**
 * GitHub Pages serves project sites at https://<user>.github.io/<repo>/
 * so Vite needs a matching asset base.
 */
function pagesBase(): string {
  const explicit = process.env.VITE_BASE_URL;
  if (explicit) return explicit.endsWith("/") ? explicit : `${explicit}/`;

  const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
  if (repo) return `/${repo}/`;

  return "/";
}

export default defineConfig({
  base: pagesBase(),
  plugins: [react()],
  resolve: {
    alias: {
      "advanced-stopwatch": path.resolve(__dirname, "../src/index.ts"),
    },
  },
});
