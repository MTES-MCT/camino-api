import geoConvert from '../tools/geo-convert'

const titreEtapePointsCalc = titrePoints =>
  titrePoints.map(point => {
    const reference =
      point.references.find(r => r.opposable) || point.references[0]

    point.coordonnees = geoConvert(reference.geoSystemeId, {
      x: reference.coordonnees.x,
      y: reference.coordonnees.y
    })

    return point
  })

export default titreEtapePointsCalc
