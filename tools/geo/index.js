// converti les coordoonnées géo

const proj4 = require('proj4')

proj4.defs(
  'EPSG:2972',
  '+proj=utm +zone=22 +ellps=GRS80 +towgs84=2,2,-2,0,0,0,0 +units=m +no_defs'
)

proj4('EPSG:2972', 'EPSG:4326', [coord1, coord2])
