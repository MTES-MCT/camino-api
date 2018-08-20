const spreadsheetToJson = require('./_utils/_spreadsheet-to-json')
const spreadsheetId = '1SCD93SteEzJIIam1fXjLW0Do815qaJj6drpKyWd1GHg'
const filePathCreate = require('./_utils/file-path-create')

const tables = ['utilisateurs', 'administrations', 'entreprises']

module.exports = async () =>
  Promise.all([
    ...tables.map(name =>
      spreadsheetToJson(filePathCreate(name), spreadsheetId, name)
    )
  ])
