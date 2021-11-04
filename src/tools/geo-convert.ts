import proj4 from 'proj4'
import { ICoordonnees } from '../types'

const geoConvert = (epsgId: string, coords: ICoordonnees): ICoordonnees => {
  const fromProjection = `EPSG:${epsgId}`
  const toProjection = 'EPSG:4326'

  if (fromProjection === toProjection) {
    return coords
  }

  return proj4(fromProjection, toProjection, coords)
}

export { geoConvert }
