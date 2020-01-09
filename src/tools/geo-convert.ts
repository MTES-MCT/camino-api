// converti les coordoonnées géo
import * as proj4 from 'proj4'
import { geoSystemesGet } from '../database/queries/metas'

const init = async () => {
  const geoSystemes = await geoSystemesGet()
  proj4.defs(
    geoSystemes.map(geosystem => [
      `EPSG:${geosystem.id}`,
      geosystem.definitionProj4
    ])
  )
}

init()

const geoConvert = (epsgId: string, coords: proj4.TemplateCoordinates) => {
  return proj4(`EPSG:${epsgId}`, 'EPSG:4326', coords)
}

export default geoConvert
