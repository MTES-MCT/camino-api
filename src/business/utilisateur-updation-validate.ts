import { IAdministration, IUtilisateur } from '../types'

import { userGet } from '../database/queries/utilisateurs'

import { permissionAdministrationsCheck } from '../tools/permission'

import { diffFind } from '../tools'

const utilisateurUpdationValidate = async (
  user: IUtilisateur,
  utilisateur: IUtilisateur,
  isAdmin: boolean
) => {
  const utilisateurOld = await userGet(utilisateur.id)
  if (!utilisateurOld) return ["l'utilisateur n'existe pas"]

  if (utilisateur.administrations && utilisateur.administrations.length > 1) {
    return [
      "un utilisateur ne peut être affectué qu'à une seule administration"
    ]
  }

  // récupère la liste des administrations modifiées (suppression et ajout)
  const administrationsIdsDiff = diffFind(
    'id',
    utilisateurOld.administrations as Partial<IAdministration>[],
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
        permissionAdministrationsCheck(user, [administration.id])
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
        permissionAdministrationsCheck(user, [id])
      )
    ) {
      // alors il ne peut modifier les permissions
      return ['droits admin insuffisants pour modifier les permissions']
    }
  }

  return []
}

export default utilisateurUpdationValidate
