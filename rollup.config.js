import filesize from 'rollup-plugin-filesize'
import license from 'rollup-plugin-license'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'

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
    license({
      banner: {
        file: 'LICENSE'
      }
    })
  ]
}
