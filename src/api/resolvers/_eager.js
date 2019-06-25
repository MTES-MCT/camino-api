import * as graphqlFields from 'graphql-fields'

const fieldsOrderDesc = ['etablissements', 'demarches', 'etapes', 'activites']
const fieldsToRemove = ['coordonnees']
const fieldsToRemoveRoot = ['references']
const fieldsGeoToReplace = ['geojsonPoints', 'geojsonMultiPolygon']
const fieldsPropsEtapes = ['surface', 'volume', 'engagement']

// ajoute des propriétés requises par /database/queries/_format
const fieldsTitreFormat = (obj, isRoot) => {
  // ajoute la propriété `type` sur les administrations
  if (
    obj.administrations &&
    !obj.administrations.type &&
    Object.keys(obj.administrations).length !== 0
  ) {
    obj.administrations.type = { id: {} }
  }

  // ajoute la propriété `titreType` sur les démarches
  if (obj.demarches && !obj.demarches.titreType) {
    obj.demarches.titreType = { id: {} }
  }

  // ajoute la propriété `type` sur les activités
  if (obj.activites && !obj.activites.type) {
    obj.activites.type = { id: {} }
  }

  // si `geojsonPoints` ou `geojsonMultiPolygon` sont présentes
  // - ajoute la propriété `points`
  // - supprime les propriété `geojsonPoints` ou `geojsonMultiPolygon`
  fieldsGeoToReplace.forEach(key => {
    if (obj[key]) {
      if (!obj.points) {
        obj.points = { id: {} }
      }

      delete obj[key]
    }
  })

  // supprime le champs `coordonees`
  fieldsToRemove.forEach(key => {
    if (obj[key]) {
      delete obj[key]
    }
  })

  if (
    obj.pays &&
    obj.pays.regions &&
    obj.pays.regions.departements &&
    obj.pays.regions.departements.communes
  ) {
    obj.communes = {
      departement: {
        region: {
          pays: { id: {} }
        }
      }
    }

    delete obj.pays
  }

  // à la racine de l'objet
  if (isRoot) {
    // si les propriété `surface`, `volume` ou `engagement` sont présentes
    // - les remplace par `surfaceEtape`, `volumeEtape` ou `engagementEtape`
    fieldsPropsEtapes.forEach(key => {
      if (obj[key]) {
        obj[`${key}Etape`] = { id: {} }

        delete obj[key]
      }
    })

    // supprime le champs `references`
    fieldsToRemoveRoot.forEach(key => {
      if (obj[key]) {
        delete obj[key]
      }
    })
  }

  return obj
}

// in: objet {cle1: { id: {}}, cle2: {id: {}}}
// out: array ["cle1", "cle2"]
const fieldsFind = (obj, isRoot) => {
  obj = fieldsTitreFormat(obj, isRoot)

  return Object.keys(obj).reduce((acc, key) => {
    // supprime les propriétés qui n'ont pas d'enfants
    if (Object.keys(obj[key]).length === 0) return acc

    // format les champs enfants récursivement
    const fieldsSub = graphQlFieldsFormat(obj[key])

    // ajoute `(orderDesc)` à certaine propriétés
    if (fieldsOrderDesc.includes(key)) {
      key = `${key}(orderDesc)`
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
const graphQlFieldsFormat = (obj, isRoot = false) => {
  const fields = fieldsFind(obj, isRoot)

  return fields.length > 1 ? `[${fields.join(', ')}]` : fields.toString()
}

const titreEagerBuild = info =>
  graphQlFieldsFormat(
    graphqlFields(info, {}, { excludedFields: ['__typename'] }),
    true
  )

export default titreEagerBuild
