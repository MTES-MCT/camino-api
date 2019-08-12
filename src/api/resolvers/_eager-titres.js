const fieldsOrderDesc = ['etablissements', 'demarches', 'etapes', 'activites']
const fieldsToRemove = ['coordonnees']
const fieldsToRemoveRoot = ['references']
const fieldsGeoToReplace = ['geojsonPoints', 'geojsonMultiPolygon']
const fieldsPropsEtapes = ['surface', 'volume', 'engagement']

// ajoute des propriétés requises par /database/queries/_format
const titreEagerFormat = (fields, parent) => {
  // ajoute la propriété `type` sur les administrations
  if (
    fields.administrations &&
    !fields.administrations.type &&
    Object.keys(fields.administrations).length !== 0
  ) {
    fields.administrations.type = { id: {} }
  }

  // ajoute la propriété `titreType` sur les démarches
  if (fields.demarches && !fields.demarches.titreType) {
    fields.demarches.titreType = { id: {} }
  }

  // ajoute la propriété `type` sur les activités
  if (fields.activites && !fields.activites.type) {
    fields.activites.type = { id: {} }
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
    (parent === 'titres' || parent === 'titre' || parent === 'etapes')
  ) {
    fields.communes = {
      departement: {
        region: {
          pays: { id: {} }
        }
      }
    }

    delete fields.pays
  }

  // ajoute `(orderDesc)` à certaine propriétés
  if (fieldsOrderDesc.includes(parent)) {
    fields.$modifier = 'orderDesc'
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

    // supprime la propriété `references`
    fieldsToRemoveRoot.forEach(key => {
      if (fields[key]) {
        delete fields[key]
      }
    })
  }

  return fields
}

export { titreEagerFormat }
