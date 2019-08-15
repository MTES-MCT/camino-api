const titreEtapePointsCheck = titrePoints => {
  const errors = titrePoints.reduce((errors, point) => {
    if (
      !point.references.every(
        ref => ref.coordonnees && ref.coordonnees.x && ref.coordonnees.y
      )
    ) {
      errors.push(
        `coordonnées du point ${point.point} / contour ${point.contour} / groupe ${point.groupe} manquantes`
      )
    }

    // TODO:
    // tester l'unité de reference.geoSysteme.unite
    // en fonction de l'unité vérifier que la donnée est formatée correctement

    return errors
  }, [])

  if (errors.length) {
    return errors.join(', ')
  }

  return null
}

export default titreEtapePointsCheck
