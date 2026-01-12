import { defineConfig } from "tsdown";
import macros from "unplugin-macros/rolldown";

export default defineConfig({
  exports: true,
  dts: true,
  minify: true,
  format: ["cjs", "esm"],
  sourcemap: true,
  target: "es2020",
  platform: "neutral",
  plugins: [macros()],
});
