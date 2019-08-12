import * as graphqlFields from 'graphql-fields'

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

// in: objet {cle1: { id: {}}, cle2: {cle3: {id: {}}, cle4: {id: {}}}}
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
// - info: objet contenant les propriétés de la requête graphQl
// - format: fonction qui transforme l'objet
// - root: nom du nœud racine
// out: string de eager pour la requête avec objection.js
const eagerBuild = (
  info,
  { format = (fields, parent) => fields, root = 'root' } = {}
) => {
  // transforme la requête graphQl en un AST
  const fields = graphqlFields(info, {}, { excludedFields: ['__typename'] })

  // in: AST de la requête GraphQl
  // out: string au format 'eager' de objection.js
  return fieldsToString(fields, root, format)
}

export default eagerBuild
