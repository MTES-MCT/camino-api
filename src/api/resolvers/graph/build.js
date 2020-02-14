// in: objet {cle1: { id: {}}, cle2: {id: {}}}
// out: array ["cle1", "cle2"]
const fieldsToArray = (fields, format) => {
  return Object.keys(fields).reduce((acc, id) => {
    const fieldsSub = fields[id]
    // supprime
    // - les propriétés qui n'ont pas d'enfants
    // - les propriétés dont le nom commence par '$' (ex: $modifier)
    if (Object.keys(fieldsSub).length === 0 || id[0] === '$') return acc

    // formate les propriétés enfants récursivement
    const fieldsSubString = fieldsToString(fieldsSub, id, format)

    // ajoute un modifieur à certaines propriétés
    if (fieldsSub.$modifier) {
      id = `${id}(${fieldsSub.$modifier})`
    }

    // si la propriété a des enfants
    // on les ajoute à la chaine
    if (fieldsSubString) {
      id = `${id}.${fieldsSubString}`
    }

    acc.push(id)

    return acc
  }, [])
}

// in:
// - fields: (objet) {cle1: { id: {}}, cle2: {cle3: {id: {}}, cle4: {id: {}}}}
// - parent: (string) le nom du parent
// - format: (function)
// out: string "[cle1, cle2.[cle3, cle4]]"
const fieldsToString = (fields, parent, format) => {
  const fieldsArray = fieldsToArray(format(fields, parent), format)

  return fieldsArray.length > 1
    ? `[${fieldsArray.join(', ')}]`
    : fieldsArray.toString()
}

// optimise la requête Sql en demandant uniquement les champs
// qui sont requis par le client GraphQl
// in:
// - fields: objet contenant les champs de la requête graphQl
// - format: fonction qui transforme l'objet
// - root: nom du nœud racine
// out: string de graph pour la requête avec objection.js
const graphBuild = (fields, root = 'root', format = fields => fields) => {
  fields = JSON.parse(JSON.stringify(fields))

  // in: AST de la requête GraphQl
  // out: string au format 'graph' de objection.js
  return fieldsToString(fields, root, format)
}

export default graphBuild
