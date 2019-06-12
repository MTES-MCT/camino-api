// formate un objet 'element' sous forme de 'row'

// in
// - element: un objet json extrait de la base de données source
// - columns: les colonnes de la spreadsheet cible
// - callbacks: un tableau avec les fonctions de transformation des données de certaines colonnes
// out
// - un objet 'row' avec les données formatées par colonnes
//   prêt à être inséré dans une spreadsheet

const rowFormat = (element, columns, parent, callbacks) =>
  columns.map(c => {
    let key = c.key || c

    let currentElement

    // si la clé est de type `parent.id`
    if (key.match('parent.')) {
      // alors on place l'élément au parent
      currentElement = parent
      // et on ne garde que la seconde partie du nom de la clé
      key = key.split('.')[1]
    } else {
      currentElement = element
    }

    return (currentElement[key] && callbacks && callbacks[key]
      ? callbacks[key](currentElement[key])
      : currentElement[key] !== undefined && currentElement[key] !== null
        ? currentElement[key]
        : ''
    ).toString()
  })

export default rowFormat
