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
      amd: 'eventemitter3',
      root: 'EventEmitter3'
    }
  }
}
