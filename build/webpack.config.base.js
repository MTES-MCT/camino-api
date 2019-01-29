const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  target: 'node',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist')
  },
  externals: [nodeExternals()]
}
