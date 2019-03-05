// import * as dateFormat from 'dateformat'

// liste des tables
// la colonne id si elle existe doit être en première position
// car c'est un mot clé réservé par l'API google
// (cf: _utils/json-to-spreadsheet.js)
const tables = [
  {
    name: 'titresActivites',
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
      // idéalement il faudrait convertir la date en yyyy-mm-dd
      // mais google spreadsheet converti le champs en "date"
      // ce qui pose un problème lors de l'import suivant
      // date: v => dateFormat(v, 'yyyy-mm-dd')
    }
  }
]

export default tables
