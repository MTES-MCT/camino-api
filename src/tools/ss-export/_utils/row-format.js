// formate un objet 'element' sous forme de 'row'

// in
// - element: un objet json extrait de la base de données source
// - columns: les colonnes de la spreadsheet cible
// - callbacks: un tableau avec les fonctions de transformation des données de certaines colonnes
// out
// - un objet 'row' avec les données formatées par colonnes
//   prêt à être inséré dans une spreadsheet

const valueFormat = (element, key, callbacks) => {
  const value = element[key]
  const callback = callbacks && callbacks[key]

  const res = value && callback ? callback(value) : value

  return res !== undefined && res !== null ? res.toString() : ''
}

const rowFormat = (element, columns, callbacks, parent) =>
  columns.map(c => {
    // si on exporte une table de jointure,
    // la définition est du type {
    //   id: 'nom de la colonne dans la spreadsheet',
    //   key: 'nom de la colonne dans la base de données'
    //   parentKey: 'nom de la colonne dans la base de données dans la table parente'
    // }
    // il n'y a qu'une clé entre key et parentKey
    if (typeof c === 'object') {
      // si la clé est de type `parent.id`
      if (c.parentKey) {
        if (!parent) {
          throw new Error(
            `parentKey sans élément parent pour la colonne ${JSON.stringify(c)}`
          )
        }

        // alors on place l'élément au parent
        // et on ne garde que la seconde partie du nom de la clé
        return valueFormat(parent, c.parentKey, callbacks)
      }

      if (c.key) {
        return valueFormat(element, c.key, callbacks)
      }

      throw new Error(
        `configuration manquante: key ou parentKey doit être présent dans  ${JSON.stringify(
          c
        )}`
      )
    } else {
      return valueFormat(element, c, callbacks)
    }
  })

export default rowFormat
