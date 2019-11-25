import restrictions from './_restrictions'

const typePermissionCheck = (typeId, user) =>
  !restrictions.typesAdministrations.find(
    rta =>
      rta.typeId === typeId &&
      rta.creationInterdit &&
      user.administrations &&
      user.administrations.find(a => a.id === rta.administrationId)
  )

const domainePermissionCheck = (domaine, user) => {
  // recherche si le domaine fait partie des domaines
  // associés aux administrations associées à l'utilisateur
  const isDomaineUserAdministration =
    user.administrations &&
    user.administrations.find(
      a => a.domaines && a.domaines.find(d => d.id === domaine.id)
    ) !== undefined
  if (!isDomaineUserAdministration) return false

  // compte le nombre de types éditables pour ce domaine
  const typesEditablesCount = domaine.types
    ? domaine.types.reduce((typesEditablesCount, type) => {
        type.editable = typePermissionCheck(type.id, user)

        type.domaineId = domaine.id

        if (type.editable) {
          typesEditablesCount += 1
        }

        return typesEditablesCount
      }, 0)
    : 0

  return typesEditablesCount > 0
}

export { typePermissionCheck, domainePermissionCheck }
