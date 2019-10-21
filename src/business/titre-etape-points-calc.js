import geoConvert from '../tools/geo-convert'
import { geoSystemeGet } from '../database/queries/metas'

const titreEtapePointsCalc = async titrePoints => {
  const uniteRatio = await uniteRatioFind(pointReferenceFind(titrePoints))

  return titrePoints.map(point => {
    const reference =
      point.references.find(r => r.opposable) || point.references[0]

    point.coordonnees = geoConvert(reference.geoSystemeId, {
      x: reference.coordonnees.x * uniteRatio,
      y: reference.coordonnees.y * uniteRatio
    })

    return point
  })
}

const pointReferenceFind = points =>
  points.length &&
  points[0].references &&
  points[0].references.length &&
  (points[0].references.find(r => r.opposable) || points[0].references[0])

const uniteRatioFind = async pointReference => {
  if (!pointReference || !pointReference.geoSystemeId) {
    return 1
  }

  const geoSysteme = await geoSystemeGet(pointReference.geoSystemeId)

  return geoSysteme && geoSysteme.unite && geoSysteme.unite.id === 'gon'
    ? 0.9
    : 1
}

export default titreEtapePointsCalc
