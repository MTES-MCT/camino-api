import geoConvert from '../tools/geo-convert'

const titreEtapePointsCalc = titrePoints =>
  titrePoints.map(point => {
    const reference =
      point.references.find(r => r.opposable) || point.references[0]

    // TODO:
    // tester l'unité de reference.geoSysteme.unite
    // si c'est du degré-minute-seconde, convertir en décimal

    point.coordonnees = geoConvert(reference.geoSystemeId, {
      x: Number(reference.coordonnees.x),
      y: Number(reference.coordonnees.y)
    })

    return point
  })

export default titreEtapePointsCalc
