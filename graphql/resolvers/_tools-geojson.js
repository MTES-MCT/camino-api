const geojsonMultiPolygonCoordinates = points =>
  points.reduce((res, p) => {
    res[p.groupe] = res[p.groupe] || []
    res[p.groupe][p.contour] = res[p.groupe][p.contour] || []
    res[p.groupe][p.contour][p.point] = [p.coordonees.x, p.coordonees.y]
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
          coordinates: [p.coordonees.x, p.coordonees.y]
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
