import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/fae.js",
  output: {
    file: "dist/fae.js",
    sourcemap: true,
    format: "es",
    name: "fae",
  },
  plugins: [resolve(), commonjs(), json(), terser()],
};
