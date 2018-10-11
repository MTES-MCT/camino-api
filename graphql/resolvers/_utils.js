const {
  geojsonFeatureMultiPolygon,
  geojsonFeatureCollectionPoints
} = require('./_geojson')

const titreFormat = t => {
  t.references =
    t.references &&
    Object.keys(t.references).map(r => ({
      type: r,
      valeur: t.references[r]
    }))

  if (t.points && t.points.length) {
    t.geojsonMultiPolygon = geojsonFeatureMultiPolygon(t.points)
    t.geojsonPoints = geojsonFeatureCollectionPoints(t.points)
  }

  t.demarches &&
    t.demarches.forEach(d => {
      d.etapes &&
        d.etapes.forEach(e => {
          if (e.points.length) {
            e.geojsonMultiPolygon = geojsonFeatureMultiPolygon(e.points)
            e.geojsonPoints = geojsonFeatureCollectionPoints(e.points)
          }
        })
    })

  if (t.volumeEtape) {
    t.volume = t.volumeEtape.volume
    t.volumeUnite = t.volumeEtape.volumeUnite
  }

  if (t.surfaceEtape) {
    t.surface = t.surfaceEtape.surface
  }

  return t
}

module.exports = { titreFormat }
