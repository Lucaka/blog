import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => {
  return {
    // GitHub Pages project site 位於子路徑 https://<user>.github.io/<repo>/，
    // 因此在 CI（GITHUB_PAGES=true）時把 base 設為 /blog/；本機開發維持 /。
    base: process.env.GITHUB_PAGES ? "/blog/" : "/",
    plugins: [qwikCity(), qwikVite(), tsconfigPaths()],
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
  };
});
