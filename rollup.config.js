import filesize from 'rollup-plugin-filesize'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import buble from 'rollup-plugin-buble'
import uglify from 'rollup-plugin-uglify'
import { version } from './package.json'

const preamble =
`// fae v${version} | MIT License | Copyright (c) 2017 Sam Woodruff`

export default {
  entry: 'src/fae.js',
  dest: 'dist/fae.js',
  sourceMap: true,

  format: 'umd',
  moduleName: 'fae',

  plugins: [
    filesize(),
    resolve(),
    commonjs(),
    json(),
    buble({
      transforms: {
        dangerousForOf: true
      }
    }),
    uglify({
      output: { preamble }
    })
  ]
}
