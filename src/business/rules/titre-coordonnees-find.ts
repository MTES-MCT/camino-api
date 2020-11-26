import { ITitrePoint } from '../../types'
import center from '@turf/center'
import { geojsonFeatureMultiPolygon } from '../../tools/geojson'

const titreCoordonneesFind = (titrePoints?: ITitrePoint[] | null) => {
  if (!titrePoints?.length) return null

  const geojson = geojsonFeatureMultiPolygon(titrePoints)
  const [x, y] = center(geojson).geometry.coordinates

  return { x, y }
}

export default titreCoordonneesFind
