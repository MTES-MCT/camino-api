// converti les coordoonnées géo
import * as proj4 from 'proj4'
import { geoSystemesGet } from '../database/queries/metas'

const geoConvertInit = async () => {
  const geoSystemes = await geoSystemesGet()

  proj4.defs(
    geoSystemes.map(geoSysteme => [
      `EPSG:${geoSysteme.id}`,
      geoSysteme.definitionProj4
    ])
  )
}

const geoConvert = (epsgId: string, coords: proj4.TemplateCoordinates) =>
  proj4(`EPSG:${epsgId}`, 'EPSG:4326', coords)

export default geoConvert

export { geoConvertInit }
