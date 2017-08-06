import filesize from 'rollup-plugin-filesize'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import buble from 'rollup-plugin-buble'
import uglify from 'rollup-plugin-uglify'
import license from 'rollup-plugin-license'

export default {
  entry: 'src/index.js',
  dest: 'dist/fae.js',
  sourceMap: true,

  format: 'umd',
  moduleName: 'fae',

  external: [ 'eventemitter3' ],
  globals: {
    eventemitter3: 'EventEmitter3'
  },

  plugins: [
    filesize(),
    resolve(),
    commonjs(),
    json({ preferConst: true }),
    buble({
      transforms: {
        dangerousForOf: true
      }
    }),
    uglify(),
    license({
      banner: {
        file: 'LICENSE'
      }
    })
  ]
}
