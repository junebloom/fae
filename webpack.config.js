const path = require('path')

module.exports = {
  devtool: 'source-map',
  entry: ['./src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'fae.js',
    library: 'fae',
    libraryTarget: 'umd'
  },
  externals: {
    'eventemitter3': {
      commonjs: 'eventemitter3',
      commonjs2: 'eventemitter3',
      amd: 'eventemitter3'
    },
    'pixi-sound': {
      commonjs: 'pixi-sound',
      commonjs2: 'pixi-sound',
      amd: 'pixi-sound'
    },
    'pixi.js': {
      commonjs: 'pixi.js',
      commonjs2: 'pixi.js',
      amd: 'pixi.js'
    }
  },
  node: {
    fs: 'empty'
  }
}
