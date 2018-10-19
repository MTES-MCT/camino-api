const spreadsheetToJson = require('./_utils/_spreadsheet-to-json')
const spreadsheetId = '1tcmn9UVF715FESbtsE1qdrZly_1yzzodWdgKwQsztEU'
const filePathCreate = require('./_utils/file-path-create')

const tables = [
  'domaines',
  'types',
  'domaines__types',
  'statuts',
  'demarches_types',
  'demarches_statuts',
  'demarches_types__types',
  'demarches_types__demarches_statuts',
  'phases_statuts',
  'etapes_types',
  'etapes_statuts',
  'etapes_types__etapes_statuts',
  'demarches_types__etapes_types',
  'emprises'
]

module.exports = async () =>
  Promise.all([
    ...tables.map(name =>
      spreadsheetToJson(filePathCreate(name), spreadsheetId, name)
    )
  ])
