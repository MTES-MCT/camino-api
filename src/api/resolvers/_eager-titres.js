const fieldsOrderDesc = ['etablissements', 'demarches', 'etapes', 'activites']
const fieldsToRemove = ['coordonnees']
const fieldsToRemoveRoot = ['references']
const fieldsGeoToReplace = ['geojsonPoints', 'geojsonMultiPolygon']
const fieldsPropsEtapes = ['surface', 'volume', 'engagement']

// ajoute des propriétés requises par /database/queries/_format
const titreEagerFormat = (obj, parent) => {
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

  // supprime la propriété `coordonnees`
  fieldsToRemove.forEach(key => {
    if (obj[key]) {
      delete obj[key]
    }
  })

  if (obj.pays && (parent === 'titres' || parent === 'etapes')) {
    obj.communes = {
      departement: {
        region: {
          pays: { id: {} }
        }
      }
    }

    delete obj.pays
  }

  // ajoute `(orderDesc)` à certaine propriétés
  if (fieldsOrderDesc.includes(parent)) {
    obj.$modifier = 'orderDesc'
  }

  // à la racine de l'objet
  if (parent === 'titres') {
    // si les propriété `surface`, `volume` ou `engagement` sont présentes
    // - les remplace par `surfaceEtape`, `volumeEtape` ou `engagementEtape`
    fieldsPropsEtapes.forEach(key => {
      if (obj[key]) {
        obj[`${key}Etape`] = { id: {} }

        delete obj[key]
      }
    })

    // supprime la propriété `references`
    fieldsToRemoveRoot.forEach(key => {
      if (obj[key]) {
        delete obj[key]
      }
    })
  }

  return obj
}

export { titreEagerFormat }
