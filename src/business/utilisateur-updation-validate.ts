import { IAdministration, IUtilisateur } from '../types'

import { utilisateurGet } from '../database/queries/utilisateurs'

import { permissionsAdministrationsCheck } from '../api/resolvers/permissions/permissions-check'

import { diffFind } from '../tools'

const utilisateurUpdationValidate = async (
  user: IUtilisateur,
  utilisateur: IUtilisateur,
  isAdmin: boolean
) => {
  const utilisateurOld = await utilisateurGet(utilisateur.id!)

  // récupère la liste des administrations modifiées (suppression et ajout)
  const administrationsIdsDiff = diffFind(
    'id',
    utilisateurOld!.administrations as Partial<IAdministration>[],
    utilisateur.administrations as Partial<IAdministration>[]
  ) as IAdministration[]

  // si le user n'est pas admin
  if (!isAdmin) {
    // alors il n'a le droit de modifier
    //   ni les permissions
    if (utilisateurOld.permissionId !== utilisateur.permissionId) {
      return ['droits insuffisants pour modifier les permissions']
    }

    //   ni les administrations
    if (administrationsIdsDiff.length) {
      return ['droits insuffisants pour modifier les administrations']
    }

    return []
  }

  // sinon, le user est admin

  // si le user modifie les administrations de l'utilisateur
  if (administrationsIdsDiff.length) {
    // si le user n'a pas les droits sur toutes ces administrations
    if (
      !administrationsIdsDiff.every(administration =>
        permissionsAdministrationsCheck(user, [administration.id])
      )
    ) {
      // alors il ne peut modifier les administrations
      return ['droits admin insuffisants pour modifier les administrations']
    }
    // sinon, si le user modifie les permissions de l'utilisateur
  } else if (utilisateurOld.permissionId !== utilisateur.permissionId) {
    // et qu'il n'a pas les droits sur toutes les administrations de ce dernier
    if (
      utilisateur.administrations &&
      !utilisateur.administrations.every(({ id }) =>
        permissionsAdministrationsCheck(user, [id])
      )
    ) {
      // alors il ne peut modifier les permissions
      return ['droits admin insuffisants pour modifier les permissions']
    }
  }

  return []
}

export default utilisateurUpdationValidate
