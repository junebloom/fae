import filesize from 'rollup-plugin-filesize'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import { version } from './package.json'

const preamble = `// fae v${version} | MIT License | Copyright (c) 2017 Sam Woodruff`

export default {
  input: 'src/fae.js',
  output: {
    file: 'dist/fae.js',
    sourceMap: true,
    format: 'umd',
    name: 'fae'
  },
  plugins: [
    filesize(),
    resolve(),
    commonjs(),
    json(),
    babel(),
    uglify({
      output: { preamble }
    })
  ]
}
