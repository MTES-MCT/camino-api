import { IUtilisateur } from '../../types'
import { permissionsCheck } from './permissions-check'
import { emailCheck } from '../../tools/email-check'

const utilisateurEditionCheck = (utilisateur: IUtilisateur) => {
  const errors = []

  if (utilisateur.email && !emailCheck(utilisateur.email)) {
    errors.push('adresse email invalide')
  }

  if (
    !permissionsCheck(utilisateur, ['admin', 'editeur', 'lecteur']) &&
    utilisateur.administrations &&
    utilisateur.administrations.length
  ) {
    errors.push(
      "les permissions de cet utilisateur ne permettent pas de l'associer à une administration"
    )
  }

  if (
    !permissionsCheck(utilisateur, ['entreprise']) &&
    utilisateur.entreprises &&
    utilisateur.entreprises.length
  ) {
    errors.push(
      "les permissions de cet utilisateur ne permettent pas de l'associer à une entreprise"
    )
  }

  return errors
}

const utilisateurTestCheck = (email: string) =>
  (process.env.NODE_ENV !== 'production' || process.env.ENV !== 'prod') &&
  email === 'test@camino.local'

export { emailCheck, utilisateurEditionCheck, utilisateurTestCheck }
