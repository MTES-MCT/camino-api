// converti les coordoonnées géo
import * as proj4 from 'proj4'
import geo from '../database/cache/geo-systemes'

const geoConvertInit = async () => {
  proj4.defs(
    geo.systemes.map(geoSysteme => [
      `EPSG:${geoSysteme.id}`,
      geoSysteme.definitionProj4
    ])
  )
}

const geoConvert = (epsgId: string, coords: proj4.TemplateCoordinates) =>
  proj4(`EPSG:${epsgId}`, 'EPSG:4326', coords)

export default geoConvert

export { geoConvertInit }
