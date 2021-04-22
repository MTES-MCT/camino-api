import proj4 from 'proj4'

const geoConvert = (epsgId: string, coords: proj4.TemplateCoordinates) =>
  proj4(`EPSG:${epsgId}`, 'EPSG:4326', coords)

export { geoConvert }
