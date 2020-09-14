import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

export default {
  input: "src/fae.js",
  output: {
    file: "dist/fae.js",
    sourcemap: true,
    format: "es",
    name: "fae",
    banner: `// fae v${pkg.version} | MIT License | Copyright (c) 2020 ${pkg.author}`,
  },
  plugins: [resolve(), commonjs(), json(), terser()],
};
