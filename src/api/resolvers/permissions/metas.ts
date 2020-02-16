import { IDomaine, IUtilisateur } from '../../../types'
import restrictions from '../../../database/cache/restrictions'

const titreTypePermissionCheck = (user: IUtilisateur, titreTypeId: string) =>
  !restrictions.typesAdministrations.find(
    rta =>
      rta.typeId === titreTypeId &&
      rta.creationInterdit &&
      user.administrations &&
      user.administrations.find(a => a.id === rta.administrationId)
  )

const domainePermissionCheck = (user: IUtilisateur, domaine: IDomaine) => {
  if (!domaine.titresTypes) return false

  // si le domaine fait parti des domaines
  // associés aux administrations de l'utilisateur
  const isDomaineUserAdministration =
    user.administrations &&
    user.administrations.find(
      a => a.domaines && a.domaines.find(d => d.id === domaine.id)
    ) !== undefined

  if (!isDomaineUserAdministration) return false

  // compte le nombre de types éditables pour ce domaine
  const typesEditablesCount = domaine.titresTypes.reduce(
    (typesEditablesCount, titreType) => {
      titreType.editable = titreTypePermissionCheck(user, titreType.id)

      if (titreType.editable) {
        typesEditablesCount++
      }

      return typesEditablesCount
    },
    0
  )

  return typesEditablesCount > 0
}

export { titreTypePermissionCheck, domainePermissionCheck }
