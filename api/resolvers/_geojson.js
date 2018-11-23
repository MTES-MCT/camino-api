const geojsonMultiPolygonCoordinates = points =>
  points.reduce((res, p) => {
    res[p.groupe] = res[p.groupe] || []
    res[p.groupe][p.contour] = res[p.groupe][p.contour] || []
    res[p.groupe][p.contour][p.point] = [p.coordonnees.x, p.coordonnees.y]
    return res
  }, [])

const geojsonFeatureMultiPolygon = points => ({
  type: 'Feature',
  geometry: {
    type: 'MultiPolygon',
    coordinates: geojsonMultiPolygonCoordinates(points)
  }
})

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

module.exports = {
  geojsonMultiPolygonCoordinates,
  geojsonFeatureMultiPolygon,
  geojsonFeatureCollectionPoints
}
