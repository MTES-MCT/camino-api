/// <reference types="../@types/geojson-rewind" />
/// <reference types="../@types/turf-center" />
import rewind from 'geojson-rewind'
import center from '@turf/center'

import { ITitrePoint, IGeometry } from '../types'

// convertit des points
// en un geojson de type 'MultiPolygon'

const geojsonFeatureMultiPolygon = (points: ITitrePoint[]) => ({
  type: 'Feature',
  properties: { etapeId: points[0].titreEtapeId },
  geometry: rewind(
    {
      type: 'MultiPolygon',
      coordinates: geojsonMultiPolygonCoordinates(points)
    },
    false
  ) as IGeometry
})

// convertit des points
// en un geojson de type 'FeatureCollection' de 'Points'

const geojsonFeatureCollectionPoints = (points: ITitrePoint[]) => ({
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
      point: p.point,
      nom: p.nom,
      description: p.description,
      references: p.references
    }
  }))
})

// convertit une liste de points
// en un tableau 'coordinates' geoJson
// (le premier et le dernier point d'un contour ont les mêmes coordonnées)
const geojsonMultiPolygonCoordinates = (points: ITitrePoint[]) =>
  multiPolygonContoursClose(multiPolygonCoordinates(points))

// convertit une liste de points
// [{groupe: 1, contour: 1, point: 1, coordonnees: {x: 1.111111, y: 1.111111}}]
// en un tableau de 'coordinates': [[[[1.11111, 1.111111]]]]
const multiPolygonCoordinates = (points: ITitrePoint[]) =>
  points.reduce((res: number[][][][], p) => {
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
const multiPolygonContoursClose = (groupes: number[][][][]) =>
  groupes.map(contours =>
    contours.reduce((acc: number[][][], points) => {
      points[points.length] = points[0]
      acc.push(points)

      return acc
    }, [])
  )

const geojsonCenter = (points: ITitrePoint[]) => {
  const geojson = geojsonFeatureMultiPolygon(points)

  return center(geojson).geometry.coordinates
}

export {
  geojsonFeatureMultiPolygon,
  geojsonFeatureCollectionPoints,
  geojsonCenter
}
