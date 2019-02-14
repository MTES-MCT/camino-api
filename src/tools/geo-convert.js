// converti les coordoonnées géo
import * as proj4 from 'proj4'

// [coord1, coord2]
const geoConvert = coords => {
  proj4.defs(
    'EPSG:2972',
    '+proj=utm +zone=22 +ellps=GRS80 +towgs84=2,2,-2,0,0,0,0 +units=m +no_defs'
  )

  return proj4('EPSG:2972', 'EPSG:4326', coords)
}

export default geoConvert
