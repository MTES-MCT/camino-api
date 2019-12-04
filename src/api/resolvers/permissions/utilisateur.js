import * as emailRegex from 'email-regex'

import { permissionsCheck } from './permissions-check'

const emailCheck = email => emailRegex({ exact: true }).test(email)

const permissionUtilisateurAdministrationCheck = (utilisateur, user) =>
  user.administrations &&
  user.administrations.some(
    userAdministration =>
      utilisateur.administrations &&
      utilisateur.administrations.some(
        utilisateurAdministration =>
          userAdministration.id === utilisateurAdministration.id
      )
  )

const permissionUtilisateurEntrepriseCheck = (utilisateur, user) =>
  user.entreprises &&
  permissionsCheck(user, ['entreprise']) &&
  permissionsCheck(utilisateur, ['entreprise']) &&
  // teste si l'utilisateur connecté (user) possède une entreprise en commun
  // avec l'utilisateur à afficher ou non (utilisateur)
  user.entreprises.some(userEntreprise =>
    utilisateur.entreprises.some(
      utilisateurEntreprise => userEntreprise.id === utilisateurEntreprise.id
    )
  )

const utilisateurEditionCheck = (user, utilisateur) => {
  const errors = []

  if (
    !permissionsCheck(user, ['super']) &&
    utilisateur.permissionId === 'super'
  ) {
    errors.push(
      "droits insuffisants pour affecter ces permissions à l'utilisateur"
    )
  }

  if (!emailCheck(utilisateur.email)) {
    errors.push('adresse email invalide')
  }

  if (
    !permissionsCheck(user, ['super', 'admin']) &&
    user.email !== utilisateur.email
  ) {
    errors.push(
      "droits insuffisants pour affecter cette adresse email à l'utilisateur"
    )
  }

  if (
    !permissionsCheck(utilisateur, ['admin', 'editeur', 'lecteur']) &&
    utilisateur.administrationsIds &&
    utilisateur.administrationsIds.length
  ) {
    errors.push(
      "les permissions de cet utilisateur ne permettent pas de l'associer à une administration"
    )
  }

  if (
    !permissionsCheck(utilisateur, ['entreprise']) &&
    utilisateur.entreprisesIds &&
    utilisateur.entreprisesIds.length
  ) {
    errors.push(
      "les permissions de cet utilisateur ne permettent pas de l'associer à une entreprise"
    )
  }

  return errors
}

const utilisateurTestCheck = email =>
  (process.env.NODE_ENV !== 'production' || process.env.ENV !== 'prod') &&
  email === 'test@camino.local'

export {
  emailCheck,
  permissionUtilisateurEntrepriseCheck,
  permissionUtilisateurAdministrationCheck,
  utilisateurEditionCheck,
  utilisateurTestCheck
}
