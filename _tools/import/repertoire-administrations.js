const spreadsheetToJson = require('./_utils/_spreadsheet-to-json')
const spreadsheetId = '1SCD93SteEzJIIam1fXjLW0Do815qaJj6drpKyWd1GHg'
const filePathCreate = require('./_utils/file-path-create')

module.exports = async () =>
  spreadsheetToJson(
    filePathCreate(`repertoire-administrations`),
    spreadsheetId,
    'administrations'
  )
