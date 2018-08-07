const spreadsheetToJson = require('./_spreadsheet-to-json');
const spreadsheetId = '1tcmn9UVF715FESbtsE1qdrZly_1yzzodWdgKwQsztEU';

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
];

module.exports = () => {
  tables.forEach(name => spreadsheetToJson(spreadsheetId, name, name));
};
