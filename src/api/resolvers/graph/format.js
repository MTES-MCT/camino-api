const fieldsOrderDesc = ['etablissements', 'demarches', 'etapes', 'activites']
const fieldsOrderAsc = ['points', 'substances', 'references']
const fieldsToRemove = ['coordonnees']
const titreFieldsToRemove = []
const geoFieldsToReplace = ['geojsonPoints', 'geojsonMultiPolygon']
const titrePropsEtapesFields = ['surface', 'volume', 'engagement']

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
const graphFormat = (fields, parent) => {
  const isParentTitre = [
    'titres',
    'titre',
    'titresAmodiataire',
    'titresTitulaire'
  ].includes(parent)

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
  geoFieldsToReplace.forEach(key => {
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

  if (fields.pays && (isParentTitre || parent === 'etapes')) {
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

  if (fields.administrations) {
    if (isParentTitre) {
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

  // sur les titres
  if (isParentTitre) {
    // si les propriétés `surface`, `volume` ou `engagement` sont présentes
    // - les remplace par `surfaceEtape`, `volumeEtape` ou `engagementEtape`
    titrePropsEtapesFields.forEach(key => {
      if (fields[key]) {
        fields[`${key}Etape`] = { id: {} }

        delete fields[key]
      }
    })

    // supprime certaines propriétés
    titreFieldsToRemove.forEach(key => {
      if (fields[key]) {
        delete fields[key]
      }
    })

    // trie les types de titres
    if (fields.type) {
      fields.type.$modifier = 'orderAsc'
    }
  }

  if (parent === 'activites' || parent === 'activite') {
    if (!fields.type) {
      fields.type = { id: {} }
    }

    if (!fields.type.administrations) {
      fields.type.administrations = { id: {} }
    }

    if (!fields.titre) {
      fields.titre = { id: {} }
    }

    if (!fields.titre.titulaires) {
      fields.titre.titulaires = { id: {} }
    }

    if (!fields.titre.amodiataires) {
      fields.titre.amodiataires = { id: {} }
    }
  }

  if (parent === 'utilisateurs' || parent === 'utilisateur') {
    if (fields.sections) {
      delete fields.sections
    }
  }

  // on a besoin des activités si elles sont absentes
  // pour calculer le nombre d'activités par type
  if (!fields.activites) {
    if (
      fields.activitesDeposees ||
      fields.activitesEnConstruction ||
      fields.activitesAbsentes
    ) {
      fields.activites = { id: {} }
    }
  }

  return fields
}

export default graphFormat
