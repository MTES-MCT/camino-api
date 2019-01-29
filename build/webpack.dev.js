const rm = require('rimraf')
const path = require('path')
const webpack = require('webpack')
const webpackPluginProgress = require('webpack/lib/ProgressPlugin')
const { webpackPluginProgressHandler, webpackRunCallback } = require('./_utils')
const webpackConfigDev = require('./webpack.config.dev')
const compiler = webpack(webpackConfigDev)

rm(path.join(__dirname, '../example/dist'), err => {
  if (err) {
    throw err
  }
  compiler.apply(new webpackPluginProgress(webpackPluginProgressHandler))

  compiler.watch(
    {
      // Example watchOptions
      aggregateTimeout: 300,
      poll: undefined
    },
    webpackRunCallback
  )
})
