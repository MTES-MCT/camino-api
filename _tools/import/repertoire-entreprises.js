const spreadsheetToJson = require('./_utils/_spreadsheet-to-json')
const spreadsheetId = '1DbpD49cEHkbAAh-roSWGRr4GeMJVe9c_ymSNaBOJVkc'
const filePathCreate = require('./_utils/file-path-create')

const tables = ['a', 'c', 'f', 'g', 'h', 'm', 'm973', 's', 'w']

module.exports = async () =>
  Promise.all([
    ...tables.map(name =>
      spreadsheetToJson(
        filePathCreate(`repertoire-entreprises-${name}`),
        spreadsheetId,
        name
      )
    )
  ])
