import { ITitresPoints } from '../types'

// import * as rewind from 'geojson-rewind'

// converti des points
// en un geojson de type 'MultiPolygon'

const geojsonFeatureMultiPolygon = (points: ITitresPoints[]) => ({
  type: 'Feature',
  properties: { etapeId: points[0].titreEtapeId },
  geometry: {
    type: 'MultiPolygon',
    coordinates: geojsonMultiPolygonCoordinates(points)
  }
})

// converti des points
// en un geojson de type 'FeatureCollection' de 'Points'

const geojsonFeatureCollectionPoints = (points: ITitresPoints[]) => ({
  type: 'FeatureCollection',
  properties: { etapeId: points[0].titreEtapeId },
  features: points.map(p => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [p.coordonnees.x, p.coordonnees.y]
    },
    properties: {
      id: p.id,
      groupe: p.groupe,
      contour: p.contour,
      point: p.point
    }
  }))
})

// converti une liste de points
// en un tableau 'coordinates' geoJson
// (le premier et le dernier point d'un contour ont les mêmes coordonnées)
const geojsonMultiPolygonCoordinates = (points: ITitresPoints[]) =>
  multiPolygonContoursClose(multiPolygonCoordinates(points))

// converti une liste de points
// [{groupe: 1, contour: 1, point: 1, coordonnees: {x: 1.111111, y: 1.111111}}]
// en un tableau de 'coordinates': [[[[1.11111, 1.111111]]]]
const multiPolygonCoordinates = (points: ITitresPoints[]) =>
  points.reduce((res, p) => {
    res[p.groupe - 1] = res[p.groupe - 1] || []
    res[p.groupe - 1][p.contour - 1] = res[p.groupe - 1][p.contour - 1] || []
    res[p.groupe - 1][p.contour - 1][p.point - 1] = [
      p.coordonnees.x,
      p.coordonnees.y
    ]

    return res
  }, [] as number[][][][])

// duplique le premier point de chaque contour
// en fin de contour pour fermer le tracé
const multiPolygonContoursClose = (groupes: number[][][][]) =>
  groupes.map(contours =>
    contours.reduce((acc, points) => {
      points[points.length] = points[0]
      acc.push(points)

      return acc
    }, [] as number[][][])
  )

export { geojsonFeatureMultiPolygon, geojsonFeatureCollectionPoints }
