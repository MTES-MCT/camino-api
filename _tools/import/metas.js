const spreadsheetToJson = require('./_utils/_spreadsheet-to-json')
const spreadsheetId = '1tcmn9UVF715FESbtsE1qdrZly_1yzzodWdgKwQsztEU'
const filePathCreate = require('./_utils/file-path-create')

const tables = [
  'domaines',
  'types',
  'domaines__types',
  'statuts',
  'demarches',
  'demarches_statuts',
  'demarches__types',
  'demarches__demarches_statuts',
  'phases_statuts',
  'etapes',
  'etapes_statuts',
  'etapes__etapes_statuts',
  'demarches__etapes',
  'emprises'
]

module.exports = async () =>
  Promise.all([
    ...tables.map(name =>
      spreadsheetToJson(filePathCreate(name), spreadsheetId, name)
    )
  ])
