// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
export default defineConfig({
 build: {
  lib: {
   entry: resolve(__dirname, "src/index.ts"),
   formats: ["es", "cjs"],
  },
  rollupOptions: {
   external: ["axios"],
  },
 },
 plugins: [dts({ rollupTypes: true })], // emit TS declaration files
});
