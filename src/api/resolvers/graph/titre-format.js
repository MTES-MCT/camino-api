const fieldsOrderDesc = ['etablissements', 'demarches', 'etapes', 'activites']
const fieldsOrderAsc = ['points', 'substances', 'references']
const fieldsToRemove = ['coordonnees']
const fieldsToRemoveRoot = []
const fieldsGeoToReplace = ['geojsonPoints', 'geojsonMultiPolygon']
const fieldsPropsEtapes = ['surface', 'volume', 'engagement']

const graphTitreAdministrationsFormat = (fields, type) => {
  if (!fields.administrations) return

  fields[`administrations${type}`] = {
    ...fields.administrations
  }

  if (
    !fields.administrations.type &&
    Object.keys(fields.administrations).length !== 0
  ) {
    fields[`administrations${type}`].type = { id: {} }
  }
}

// ajoute des propriétés requises par /database/queries/_format
const graphTitreFormat = (fields, parent) => {
  if (fields.administrations) {
    if (
      ['titres', 'titre', 'titresAmodiataire', 'titresTitulaire'].includes(
        parent
      )
    ) {
      // ajoute la propriété `type` sur les administrations
      graphTitreAdministrationsFormat(fields, 'Locales')
      graphTitreAdministrationsFormat(fields, 'Gestionnaires')
      delete fields.administrations
    } else if (
      !fields.administrations.type &&
      Object.keys(fields.administrations).length !== 0
    ) {
      fields.administrations.type = { id: {} }
    }
  }

  // ajoute la propriété `titreType` sur les démarches
  if (fields.demarches && !fields.demarches.titreType) {
    fields.demarches.titreType = { id: {} }
  }

  // ajoute la propriété `type` sur les activités
  if (fields.activites && !fields.activites.type) {
    fields.activites.type = { id: {}, administrations: { id: {} } }
  }

  // si `geojsonPoints` ou `geojsonMultiPolygon` sont présentes
  // - ajoute la propriété `points`
  // - supprime les propriété `geojsonPoints` ou `geojsonMultiPolygon`
  fieldsGeoToReplace.forEach(key => {
    if (fields[key]) {
      if (!fields.points) {
        fields.points = { id: {} }
      }

      delete fields[key]
    }
  })

  // supprime la propriété `coordonnees`
  fieldsToRemove.forEach(key => {
    if (fields[key]) {
      delete fields[key]
    }
  })

  if (
    fields.pays &&
    [
      'titres',
      'titre',
      'etapes',
      'titresTitulaire',
      'titresAmodiataire'
    ].includes(parent)
  ) {
    fields.communes = { departement: { region: { pays: { id: {} } } } }

    delete fields.pays
  }

  // ajoute `(orderDesc)` à certaine propriétés
  if (fieldsOrderDesc.includes(parent)) {
    fields.$modifier = 'orderDesc'
  }

  // ajoute `(orderAsc)` à certaine propriétés
  if (fieldsOrderAsc.includes(parent)) {
    fields.$modifier = 'orderAsc'
  }

  // à la racine de l'objet
  if (
    parent === 'titres' ||
    parent === 'titre' ||
    parent === 'titresAmodiataire' ||
    parent === 'titresTitulaire'
  ) {
    // si les propriétés `surface`, `volume` ou `engagement` sont présentes
    // - les remplace par `surfaceEtape`, `volumeEtape` ou `engagementEtape`
    fieldsPropsEtapes.forEach(key => {
      if (fields[key]) {
        fields[`${key}Etape`] = { id: {} }

        delete fields[key]
      }
    })

    // supprime certaines propriétés
    fieldsToRemoveRoot.forEach(key => {
      if (fields[key]) {
        delete fields[key]
      }
    })
  }

  return fields
}

export default graphTitreFormat
