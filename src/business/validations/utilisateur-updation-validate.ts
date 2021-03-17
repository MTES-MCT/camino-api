import { IAdministration, IUtilisateur } from '../../types'

import { userGet } from '../../database/queries/utilisateurs'

import {
  permissionAdministrationsCheck,
  permissionCheck
} from '../../tools/permission'

import { diffFind } from '../../tools'

/**
 * Valide la mise à jour d'un utilisateur
 *
 * @param user - utilisateur qui fait la modification
 * @param utilisateur - utilisateur modifié
 * @param isAdmin - si la permission de l'utilisateur qui fait la modification est `admin`
 * @param isSuper- si la permission de l'utilisateur qui fait la modification est `super`
 *
 * @returns une liste de messages d'erreur si l'utilisateur n'a pas le droit de faire les modifications
 */

const utilisateurUpdationValidate = async (
  user: IUtilisateur,
  utilisateur: IUtilisateur,
  isAdmin: boolean,
  isSuper: boolean
) => {
  const utilisateurOld = await userGet(utilisateur.id)

  if (!utilisateurOld) return ["l'utilisateur n'existe pas"]

  if (utilisateur.administrations && utilisateur.administrations.length > 1) {
    return ["un utilisateur ne peut être affecté qu'à une seule administration"]
  }

  if (!isSuper) {
    // récupère la liste des administrations modifiées (suppression et ajout)
    const administrationsIdsDiff = diffFind(
      'id',
      utilisateurOld.administrations as Partial<IAdministration>[],
      utilisateur.administrations as Partial<IAdministration>[]
    ) as IAdministration[]

    // si le user n'est pas admin
    if (!isAdmin) {
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
  }

  if (
    permissionCheck(utilisateur.permissionId, [
      'admin',
      'editeur',
      'lecteur'
    ]) &&
    !utilisateur.administrations?.length
  ) {
    return ["l'utilisateur doit être associé à une administration"]
  }

  return []
}

export { utilisateurUpdationValidate }
