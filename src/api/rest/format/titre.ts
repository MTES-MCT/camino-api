import { ITitre } from '../../../types'

const typenameOmit = (key: string, value: any) =>
  key === '__typename' ? undefined : value

const cloneAndClean = (json: any[]) =>
  JSON.parse(JSON.stringify(json), typenameOmit)

const titreFormatGeojson = (titre: ITitre) => ({
  type: 'FeatureCollection',
  properties: {
    id: titre.id,
    nom: titre.nom
  },
  features: cloneAndClean(
    [titre.geojsonMultiPolygon].concat(
      titre.geojsonPoints ? titre.geojsonPoints.features : []
    )
  )
})

export { titreFormatGeojson }
