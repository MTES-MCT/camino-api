import * as graphqlFields from 'graphql-fields'

const fieldsOrderDesc = ['etablissements', 'demarches', 'etapes', 'activites']
const fieldsToRemove = ['coordonnees']
const fieldsToRemoveRoot = ['references']
const fieldsGeoToReplace = ['geojsonPoints', 'geojsonMultiPolygon']
const fieldsPropsEtapes = ['surface', 'volume', 'engagement']

// in: objet {cle1: { id: {}}, cle2: {id: {}}}
// out: array ["cle1", "cle2"]
const fieldsFind = (obj, isRoot) => {
  // ajoute des propriétés qui sont requises par /database/queries/_format
  if (
    obj.administrations &&
    !obj.administrations.type &&
    Object.keys(obj.administrations).length !== 0
  ) {
    obj.administrations.type = { id: {} }
  }

  if (obj.demarches && !obj.demarches.titreType) {
    obj.demarches.titreType = { id: {} }
  }

  if (obj.activites && !obj.activites.type) {
    obj.activites.type = { id: {} }
  }

  // converti le premier niveau en tableau
  const fieldsAll = Object.keys(obj)

  return fieldsAll.reduce((acc, key) => {
    if (isRoot && fieldsPropsEtapes.includes(key))
      return [...acc, `${key}Etape`]

    if (
      Object.keys(obj[key]).length === 0 ||
      fieldsToRemove.includes(key) ||
      (fieldsToRemoveRoot.includes(key) && isRoot)
    )
      return acc

    if (fieldsGeoToReplace.includes(key)) {
      if (!fieldsAll.includes('points') && !acc.includes('points')) {
        return [...acc, 'points']
      } else {
        return acc
      }
    }

    const fieldsSub = graphQlFieldsFormat(obj[key])

    if (fieldsOrderDesc.includes(key)) {
      key = `${key}(orderDesc)`
    }

    if (!fieldsSub) return [...acc, key]

    key = `${key}.${fieldsSub}`

    if (key === 'pays.regions.departements.communes') {
      key = 'communes.departement.region.pays'
    }

    return [...acc, key]
  }, [])
}

// in: objet {cle1: { id: {}}, cle2: {cle3: {id: {}}, cle4: {id: {}}}}
// out: string "[cle1, cle2.[cle3, cle4]]"
const graphQlFieldsFormat = (obj, isRoot = false) => {
  const fields = fieldsFind(obj, isRoot)

  return fields.length > 1 ? `[${fields.join(', ')}]` : fields.toString()
}

const titreEagerBuild = info =>
  // console.log(
  //   JSON.stringify(
  //     graphqlFields(info, {}, { excludedFields: ['__typename'] }),
  //     null,
  //     2
  //   )
  // )
  graphQlFieldsFormat(
    graphqlFields(info, {}, { excludedFields: ['__typename'] }),
    true
  )

export default titreEagerBuild
