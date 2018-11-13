// formate un objet 'element' sous forme de 'row'
const decamelize = require('decamelize')

// in
// - element: un objet json extrait de la base de données source
// - columns: les colonnes de la spreadsheet cible
// - callbacks: un tableau avec les fonctions de transformation des données de certaines colonnes
// out
// - un objet 'row' avec les données formatées par colonnes
//   prêt à être inséré dans une spreadsheet

const rowFormat = (element, columns, callbacks) =>
  columns.reduce(
    (row, column) =>
      element[column]
        ? Object.assign(row, {
            // id est un mot clé réservé par google
            // pour contourner cette limitation, on converti id en Id
            [column === 'id' ? 'Id' : decamelize(column)]:
              callbacks && Object.keys(callbacks).find(cb => cb === column)
                ? callbacks[column](element[column])
                : element[column]
          })
        : row,
    {}
  )

module.exports = rowFormat
