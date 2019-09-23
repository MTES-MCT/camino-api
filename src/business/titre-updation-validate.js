const titreUpdationValidate = async titreNew => {
  // vérifie
  // - si un titre contient des démarches qui ne sont pas recevables
  const errors = []

  const match = titreNew.id.match(/^(.)-(...)/)
  if (!match) {
    return null
  }

  const [, domaineId, typeId] = match

  if (
    (domaineId !== titreNew.domaineId || typeId !== titreNew.typeId) &&
    titreNew.activites &&
    titreNew.activites.length > 0
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
