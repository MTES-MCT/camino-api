const dateFormat = require('dateformat')

// liste des tables
// la colonne id si elle existe doit être en première position
// car c'est un mot clé réservé par l'API google
// (cf: _utils/json-to-spreadsheet.js)
const tables = [
  {
    name: 'titresTravauxRapports',
    columns: ['id', 'titreId', 'date', 'contenu'],
    callbacks: {
      contenu: v => JSON.stringify(v),
      date: v => dateFormat(v, 'yyyy-mm-dd')
    }
  }
]

module.exports = tables
