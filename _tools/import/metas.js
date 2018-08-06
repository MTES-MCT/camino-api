const build = require('./_build')
const spreadsheetId = '1tcmn9UVF715FESbtsE1qdrZly_1yzzodWdgKwQsztEU'

const tables = [
  'domaines',
  'types',
  'domaines_types',
  'statuts',
  'demarches',
  'demarches_statuts',
  'etapes',
  'etapes_statuts',
  'demarches_etapes',
  'emprises'
]

module.exports = () => {
  tables.forEach(name => build(spreadsheetId, name, name))
}
