import * as cryptoRandomString from 'crypto-random-string'
import { permissionsCheck } from './_permissions-check'

import { utilisateurGet } from '../../database/queries/utilisateurs'

const userIdGenerate = async () => {
  const id = cryptoRandomString({ length: 6 })
  const utilisateurWithTheSameId = await utilisateurGet(id)
  if (utilisateurWithTheSameId) {
    return userIdGenerate()
  }

  return id
}

const permissionUtilisateurAdministrationCheck = (utilisateur, user) =>
  user.administrations.some(userAdministration =>
    utilisateur.administrations.some(
      utilisateurAdministration =>
        userAdministration.id === utilisateurAdministration.id
    )
  )

const permissionUtilisateurEntrepriseCheck = (utilisateur, user) =>
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

export { utilisateursFormat, utilisateurFormat, userIdGenerate }
