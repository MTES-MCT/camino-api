import { ITitrePoint, ITitrePointReference, ICoordonnees } from '../types'
import geoConvert from '../tools/geo-convert'
import geoSystemes from '../database/cache/geo-systemes'

const titreEtapePointsCalc = (titrePoints: ITitrePoint[]) => {
  const uniteRatio = uniteRatioFind(pointReferenceFind(titrePoints))

  return titrePoints.map(point => {
    const reference =
      point.references.find(r => r.opposable) || point.references[0]

    point.coordonnees = geoConvert(reference.geoSystemeId, {
      x: reference.coordonnees.x * uniteRatio,
      y: reference.coordonnees.y * uniteRatio
    }) as ICoordonnees

    return point
  })
}

const pointReferenceFind = (points: ITitrePoint[]) =>
  points.length &&
  points[0].references &&
  points[0].references.length &&
  (points[0].references.find(r => r.opposable) || points[0].references[0])

const uniteRatioFind = (pointReference: ITitrePointReference | 0) => {
  if (!pointReference || !pointReference.geoSystemeId) return 1

  const geoSysteme = geoSystemes.find(
    ({ id }) => pointReference.geoSystemeId === id
  )

  return geoSysteme && geoSysteme.unite && geoSysteme.unite.id === 'gon'
    ? 0.9
    : 1
}

export default titreEtapePointsCalc
