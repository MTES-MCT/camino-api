const build = require('./_build.js')
const spreadsheetId = '1wm64Ot7QAAslHOlXYSTtws6NKOMdKsN575615QCHQiA'
const type = 'm'

module.exports = () => {
  build(spreadsheetId, type)
}
