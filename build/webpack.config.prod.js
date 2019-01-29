const merge = require('webpack-merge')
const webpackConfigBase = require('./webpack.config.base')

const webpackConfigProd = {
  mode: 'production',
  devtool: false,
  entry: {
    index: './src/index.js',
    import: './src/tools/import/index.js',
    export: './src/tools/export/index.js',
    'export-users': './src/tools/export/utilisateurs.js',
    'export-rapports': './src/tools/export/titres-travaux-rapports.js',
    daily: './src/tasks/daily/index.js'
  }
}

module.exports = merge(webpackConfigBase, webpackConfigProd)
