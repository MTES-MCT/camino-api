import { IUtilisateur } from '../../../types'

import { permissionsCheck } from '../permissions/permissions-check'
import {
  permissionUtilisateurAdministrationCheck,
  permissionUtilisateurEntrepriseCheck
} from '../permissions/utilisateur'

const utilisateurFormat = (
  user: IUtilisateur | undefined,
  utilisateur: IUtilisateur
) => {
  // si
  // - user n'existe pas (pas d'utilisateur connecté)
  // - ou l'utilisateur n'existe pas (pas d'utilisateur avec cette id)
  // - ou l'utilisateur n'a pas d'email (compte supprimé)
  // - ou
  //   - l'utilisateur connecté (user) n'est pas l'utilisateur à afficher
  //   - et l'utilisateur connecté n'est pas super admin
  //   - et l'utilisateur connecté ne possède pas d'entreprise en commun
  //   - et l'utilisateur connecté ne possède pas d'administration en commun
  if (
    !user ||
    !utilisateur ||
    !utilisateur.email ||
    (user.id !== utilisateur.id &&
      !permissionsCheck(user, ['super', 'admin']) &&
      !permissionUtilisateurAdministrationCheck(user, utilisateur) &&
      !permissionUtilisateurEntrepriseCheck(user, utilisateur))
  ) {
    return null
  }

  utilisateur.editable =
    permissionsCheck(user, ['super', 'admin']) || user.id === utilisateur.id
  utilisateur.supprimable =
    permissionsCheck(user, ['super', 'admin']) || user.id === utilisateur.id
  utilisateur.permissionEditable = permissionsCheck(user, ['super', 'admin'])

  return utilisateur
}

const utilisateursFormat = (
  user: IUtilisateur | undefined,
  utilisateurs: IUtilisateur[]
) =>
  utilisateurs &&
  utilisateurs.reduce(
    (acc, u) => {
      const utilisateur = utilisateurFormat(user, u)

      if (utilisateur) {
        acc.push(utilisateur)
      }

      return acc
    },
    [] as IUtilisateur[]
  )

export { utilisateurFormat, utilisateursFormat }
