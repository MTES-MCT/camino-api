import * as rewind from 'geojson-rewind'

// converti des points
// en un geojson de type 'MultiPolygon'

const geojsonFeatureMultiPolygon = points => ({
  type: 'Feature',
  properties: {
    etapeId: points[0].titreEtapeId
  },
  geometry: rewind(
    {
      type: 'MultiPolygon',
      coordinates: geojsonMultiPolygonCoordinates(points)
    },
    false
  )
})

// converti des points
// en un geojson de type 'FeatureCollection' de 'Points'

const geojsonFeatureCollectionPoints = points => ({
  type: 'FeatureCollection',
  properties: { etapeId: points[0].titreEtapeId },
  features: [
    ...points.map(p => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [p.coordonnees.x, p.coordonnees.y]
      },
      properties: {
        id: p.id,
        groupe: p.groupe,
        contour: p.contour,
        point: p.point,
        references: p.references
      }
    }))
  ]
})

// converti une liste de points
// en un tableau 'coordinates' geoJson
// (le premier et le dernier point d'un contour ont les mêmes coordonnées)
const geojsonMultiPolygonCoordinates = points =>
  multiPolygonContoursClose(multiPolygonCoordinates(points))

// converti une liste de points
// [{groupe: 1, contour: 1, point: 1, coordonnees: {x: 1.111111, y: 1.111111}}]
// en un tableau de 'coordinates': [[[[1.11111, 1.111111]]]]
const multiPolygonCoordinates = points =>
  points.reduce((res, p) => {
    res[p.groupe - 1] = res[p.groupe - 1] || []
    res[p.groupe - 1][p.contour - 1] = res[p.groupe - 1][p.contour - 1] || []
    res[p.groupe - 1][p.contour - 1][p.point - 1] = [
      p.coordonnees.x,
      p.coordonnees.y
    ]
    return res
  }, [])

// duplique le premier point de chaque contour
// en fin de contour pour fermer le tracé
const multiPolygonContoursClose = groupes =>
  groupes.map(contours =>
    contours.reduce((acc, points) => {
      points[points.length] = points[0]
      return [...acc, points]
    }, [])
  )

export { geojsonFeatureMultiPolygon, geojsonFeatureCollectionPoints }
