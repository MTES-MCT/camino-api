// converti les coordoonnées géo
import * as proj4 from 'proj4'
import { geoSystemesGet } from '../database/queries/metas'

const proj4BaseSynchro = async () => {
  const geoSystemes = await geoSystemesGet()
  proj4.defs(
    geoSystemes.map(geosystem => {
      return [`EPSG:${geosystem.id}`, geosystem.definitionProj4]
    })
  )
}

proj4BaseSynchro()

const geoConvert = (epsgId: string, coords: proj4.TemplateCoordinates) => {
  return proj4(`EPSG:${epsgId}`, 'EPSG:4326', coords)
}

export default geoConvert
