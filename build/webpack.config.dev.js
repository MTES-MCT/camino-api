const webpackPluginNodemon = require('nodemon-webpack-plugin')
const merge = require('webpack-merge')
const webpackConfigBase = require('./webpack.config.base')

const webpackConfigDev = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    index: './src/index.ts'
  },
  plugins: [new webpackPluginNodemon()]
}

module.exports = merge(webpackConfigBase, webpackConfigDev)
