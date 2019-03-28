// formate un objet 'element' sous forme de 'row'

// in
// - element: un objet json extrait de la base de données source
// - columns: les colonnes de la spreadsheet cible
// - callbacks: un tableau avec les fonctions de transformation des données de certaines colonnes
// out
// - un objet 'row' avec les données formatées par colonnes
//   prêt à être inséré dans une spreadsheet

const rowFormat = (element, columns, callbacks) =>
  columns.map(c =>
    (element[c] && callbacks && callbacks[c]
      ? callbacks[c](element[c])
      : element[c] || ''
    ).toString()
  )

export default rowFormat
