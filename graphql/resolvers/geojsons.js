const { titres } = require('../../postgres/queries/titres')
const { geojsonMultiPolygonCoordinates } = require('./_tools-geojson')

const resolvers = {
  geojsonMultiPolygons: async (
    { typeIds, domaineIds, statutIds, polices, substances },
    context,
    info
  ) => {
    const ts = await titres(
      { typeIds, domaineIds, statutIds, polices, substances },
      context.user
    )

    const features = ts.map(t => {
      return {
        type: 'Feature',
        properties: t,
        geometry: {
          type: 'MultiPolygon',
          coordinates: geojsonMultiPolygonCoordinates(t.phases[0].points)
        }
      }
    })

    return {
      type: 'FeatureCollection',
      features
    }
  }
}

module.exports = resolvers
