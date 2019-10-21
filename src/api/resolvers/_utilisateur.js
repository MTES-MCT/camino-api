import * as cryptoRandomString from 'crypto-random-string'
import * as emailRegex from 'email-regex'

import { permissionsCheck } from './_permissions-check'

import { utilisateurGet } from '../../database/queries/utilisateurs'

const emailCheck = email => emailRegex({ exact: true }).test(email)

const userIdGenerate = async () => {
  const id = cryptoRandomString({ length: 6 })
  const utilisateurWithTheSameId = await utilisateurGet(id)
  if (utilisateurWithTheSameId) {
    return userIdGenerate()
  }

  return id
}

const permissionUtilisateurAdministrationCheck = (utilisateur, user) =>
  user.administrations &&
  user.administrations.some(userAdministration =>
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

export {
  emailCheck,
  userIdGenerate,
  utilisateurEditionCheck,
  utilisateurFormat,
  utilisateursFormat
}
