import { permissionsCheck } from '../permissions/permissions-check'
import {
  permissionUtilisateurAdministrationCheck,
  permissionUtilisateurEntrepriseCheck
} from '../permissions/titre'

const utilisateurFormat = (utilisateur, user) => {
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
      !permissionsCheck(user, ['super']) &&
      !permissionUtilisateurAdministrationCheck(utilisateur, user) &&
      !permissionUtilisateurEntrepriseCheck(utilisateur, user))
  ) {
    return null
  }

  return utilisateur
}

const utilisateursFormat = (utilisateurs, user) =>
  utilisateurs &&
  utilisateurs.reduce((acc, utilisateur) => {
    const utilisateurFormated = utilisateurFormat(utilisateur, user)

    if (utilisateurFormated) {
      acc.push(utilisateurFormated)
    }

    return acc
  }, [])

export { utilisateurFormat, utilisateursFormat }
