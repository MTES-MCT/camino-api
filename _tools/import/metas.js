const build = require('./_build')
//const spreadsheetId = '1tcmn9UVF715FESbtsE1qdrZly_1yzzodWdgKwQsztEU'
const spreadsheetId = '11ylwuqvMpWeMmJ1zvEgNed4vLhf64VQYg6MZy4Y1864'

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
