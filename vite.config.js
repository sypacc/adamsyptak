import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

const root = import.meta.dirname;

// Repo project site (https://sypacc.github.io/adamsyptak/), so every
// built asset path needs the /adamsyptak/ prefix.
export default defineConfig({
  base: "/adamsyptak/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        project: resolve(root, "project/index.html"),
      },
    },
  },
});
