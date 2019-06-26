import * as graphqlFields from 'graphql-fields'

// in: objet {cle1: { id: {}}, cle2: {id: {}}}
// out: array ["cle1", "cle2"]
const fieldsToArray = (obj, format) => {
  return Object.keys(obj).reduce((acc, key) => {
    // supprime
    // - les propriétés qui n'ont pas d'enfants
    // - les propriétés dont le nom commence par '$' (ex: $modifier)
    if (Object.keys(obj[key]).length === 0 || key.slice(0, 1) === '$')
      return acc

    // formate les propriétés enfants récursivement
    const fieldsSub = fieldsAstToEagerString(obj[key], key, format)

    // ajoute un modifieur à certaines propriétés
    if (obj[key].$modifier) {
      key = `${key}(${obj[key].$modifier})`
    }

    // si la propriété a des enfants
    // on les ajoute à la chaine
    if (fieldsSub) {
      key = `${key}.${fieldsSub}`
    }

    return [...acc, key]
  }, [])
}

// in: objet {cle1: { id: {}}, cle2: {cle3: {id: {}}, cle4: {id: {}}}}
// out: string "[cle1, cle2.[cle3, cle4]]"
const fieldsAstToEagerString = (obj, parent, format) => {
  const fields = fieldsToArray(format(obj, parent), format)

  return fields.length > 1 ? `[${fields.join(', ')}]` : fields.toString()
}

// optimise la requête Sql en demandant uniquement les champs
// qui sont requis par le client GraphQl
// in:
// - info: objet contenant les propriétés de la requête graphQl
// - format: fonction qui transforme l'objet
// out: string de eager pour la requête avec objection.js
const titreEagerBuild = (info, format = (obj, parent) => obj) => {
  // transforme la requête graphQl en un AST
  // qui défini tous les champs requis par le client
  const graphQlFieldsAst = graphqlFields(
    info,
    {},
    { excludedFields: ['__typename'] }
  )

  // transforme l'ast de la requête GraphQl
  // en une string pour renseigner le eager de objection.js
  return fieldsAstToEagerString(graphQlFieldsAst, 'root', format)
}

export default titreEagerBuild
