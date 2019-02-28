// liste des tables
// la colonne id si elle existe doit être en première position
// car c'est un mot clé réservé par l'API google
// (cf: _utils/json-to-spreadsheet.js)
const tables = [
  {
    name: 'titresActivitesRapports',
    columns: [
      'id',
      'titreId',
      'utilisateurId',
      'date',
      'confirmation',
      'contenu'
    ],
    callbacks: {
      contenu: v => JSON.stringify(v)
    }
  }
]

export default tables
