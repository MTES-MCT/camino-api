import * as cryptoRandomString from 'crypto-random-string'
import permissionsCheck from './_permissions-check'

import { utilisateurGet } from '../../database/queries/utilisateurs'

const permissionsVisibleForAdmin = [
  'admin',
  'editeur',
  'lecteur',
  'entreprise',
  'onf',
  'defaut'
]

const userIdGenerate = async () => {
  const id = cryptoRandomString({ length: 6 })
  const utilisateurWithTheSameId = await utilisateurGet(id)
  if (utilisateurWithTheSameId) {
    return userIdGenerate()
  }

  return id
}

const utilisateurFormat = (utilisateur, user) => {
  // si
  // - user n'existe pas (pas d'utilisateur connecté)
  // - l'utilisateur n'existe pas (pas d'utilisateur avec cette id)
  // - l'utilisateur n'a pas d'email (compte supprimé)
  if (!user || !utilisateur || !utilisateur.email) {
    return null
  }

  if (
    user.id === utilisateur.id ||
    permissionsCheck(user, ['super']) ||
    (permissionsCheck(user, ['admin']) &&
      permissionsCheck(utilisateur, permissionsVisibleForAdmin)) ||
    (permissionsCheck(user, ['entreprise']) &&
      permissionsCheck(utilisateur, ['entreprise']) &&
      user.entreprises.some(eUser =>
        utilisateur.entreprises.some(
          eUtilisateur => eUser.id === eUtilisateur.id
        )
      ))
  ) {
    return utilisateur
  }

  return null
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
