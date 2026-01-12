import { defineConfig } from "tsdown";
import macros from "unplugin-macros/rolldown";

export default defineConfig({
  entry: ["./src/index.ts"],
  dts: true,
  format: ["cjs", "esm"],
  sourcemap: true,
  declarationMap: true,
  target: "es2020",
  platform: "neutral",
  plugins: [macros()],
});
