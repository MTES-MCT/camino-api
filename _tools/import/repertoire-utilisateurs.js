const spreadsheetToJson = require('./_utils/_spreadsheet-to-json')
const spreadsheetId = '1sxjyNHjNwEqPjowbdUDVIYLwr1X1N20e4voQJc_J4lQ'
const filePathCreate = require('./_utils/file-path-create')

const tables = ['utilisateurs', 'groupes', 'utilisateurs_groupes']

module.exports = async () =>
  Promise.all([
    ...tables.map(name =>
      spreadsheetToJson(
        filePathCreate(`repertoire-${name}`),
        spreadsheetId,
        name
      )
    )
  ])
