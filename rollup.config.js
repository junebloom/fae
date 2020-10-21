import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/fae.js",
  output: {
    name: "fae",
    dir: "dist",
    format: "es",
    sourcemap: true,
  },
  plugins: [json(), terser()],
};
