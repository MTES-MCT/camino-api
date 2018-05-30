const geojsonFeatureMultiPolygon = points => {
  const multiPolygonCoordinates = points.reduce((res, p) => {
    res[p.groupe] = res[p.groupe] || []
    res[p.groupe][p.contour] = res[p.groupe][p.contour] || []
    res[p.groupe][p.contour][p.point] = [p.coordonees.x, p.coordonees.y]
    return res
  }, [])

  return {
    type: 'Feature',
    geometry: {
      type: 'MultiPolygon',
      coordinates: multiPolygonCoordinates
    }
  }
}

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

module.exports = { geojsonFeatureMultiPolygon, geojsonFeatureCollectionPoints }
