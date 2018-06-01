const { titres } = require('../../postgres/queries/titres')
const { geojsonMultiPolygonCoordinates } = require('./_tools-geojson')

const resolvers = {
  geojsonMultiPolygons: async (
    { typeId, domaineId, statutId, police },
    context,
    info
  ) => {
    const ts = await titres(
      { typeId, domaineId, statutId, police },
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
