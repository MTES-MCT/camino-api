const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: 'production',
  target: 'node',
  entry: {
    index: './src/index.js',
    import: './src/tools/import/index.js',
    export: './src/tools/export/index.js',
    'export-users': './src/tools/export/utilisateurs.js',
    'export-rapports': './src/tools/export/titres-travaux-rapports.js',
    daily: './src/tasks/daily/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  externals: [nodeExternals()]
}
