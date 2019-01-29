const rm = require('rimraf')
const path = require('path')
const webpack = require('webpack')
const webpackPluginProgress = require('webpack/lib/ProgressPlugin')
const { webpackPluginProgressHandler, webpackRunCallback } = require('./_utils')
const webpackConfigDist = require('./webpack.config.prod')
const compiler = webpack(webpackConfigDist)

rm(path.join(__dirname, '../dist'), err => {
  if (err) {
    throw err
  }

  compiler.apply(new webpackPluginProgress(webpackPluginProgressHandler))

  compiler.run(webpackRunCallback)
})
