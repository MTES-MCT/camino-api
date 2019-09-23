const titreUpdationValidate = async (titreNew, titreOld) => {
  // vérifie
  // - si un titre contient des démarches qui ne sont pas recevables
  const errors = []

  if (
    titreOld &&
    (titreOld.domaineId !== titreNew.domaineId ||
      titreOld.typeId !== titreNew.typeId) &&
    titreOld.activites &&
    titreOld.activites.length > 0
  ) {
    errors.push(
      "impossible de changer le type ou le domaine d'un titre qui contient des activités"
    )
  }

  if (errors.length) {
    return errors.join(', ')
  }

  return null
}

export default titreUpdationValidate
