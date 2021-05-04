import { ITitre } from '../../../types'

const titreFormatGeojson = (titre: ITitre) => ({
  type: 'FeatureCollection',
  properties: {
    id: titre.id,
    nom: titre.nom
  },
  features: [titre.geojsonMultiPolygon].concat(
    titre.geojsonPoints ? titre.geojsonPoints.features : []
  )
})

export { titreFormatGeojson }
