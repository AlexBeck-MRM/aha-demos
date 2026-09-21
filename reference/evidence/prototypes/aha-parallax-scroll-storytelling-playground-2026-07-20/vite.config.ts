import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    // The lab imports shared components, fonts and assets from reference/.
    fs: { allow: [path.resolve(appRoot, "../../..")] },
  },
  resolve: {
    alias: {
      react: path.resolve(appRoot, "node_modules/react"),
      "react-dom": path.resolve(appRoot, "node_modules/react-dom"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
