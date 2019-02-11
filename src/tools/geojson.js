import * as rewind from 'geojson-rewind'

// converti des points
// [{groupe: 1, contour: 1, point: 1, coordonnees: {x: 1.111111, y: 1.111111}}]
// en un tableau 'coordinates' de geojson: [[[[1.11111, 1.111111]]]]

const geojsonMultiPolygonCoordinates = points =>
  points.reduce((res, p) => {
    res[p.groupe - 1] = res[p.groupe - 1] || []
    res[p.groupe - 1][p.contour - 1] = res[p.groupe - 1][p.contour - 1] || []
    res[p.groupe - 1][p.contour - 1][p.point - 1] = [
      p.coordonnees.x,
      p.coordonnees.y
    ]
    return res
  }, [])

// converti des points
// en un geojson de type 'MultiPolygon'

const geojsonFeatureMultiPolygon = points =>
  rewind(
    {
      type: 'Feature',
      geometry: {
        type: 'MultiPolygon',
        coordinates: geojsonMultiPolygonCoordinates(points)
      }
    },
    true
  )

// converti des points
// en un geojson de type 'FeatureCollection' de 'Point'

const geojsonFeatureCollectionPoints = points => {
  return {
    type: 'FeatureCollection',
    features: [
      ...points.map(p => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [p.coordonnees.x, p.coordonnees.y]
        },
        properties: {
          groupe: p.groupe,
          contour: p.contour,
          point: p.point
        }
      }))
    ]
  }
}

export {
  geojsonMultiPolygonCoordinates,
  geojsonFeatureMultiPolygon,
  geojsonFeatureCollectionPoints
}
