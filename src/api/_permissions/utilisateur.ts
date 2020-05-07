import { IUtilisateur, IUtilisateurCreation } from '../../types'
import { permissionCheck } from '../../tools/permission'
import { emailCheck } from '../../tools/email-check'

const utilisateurEditionCheck = (
  utilisateur: IUtilisateur | IUtilisateurCreation
) => {
  const errors = []

  if (utilisateur.email && !emailCheck(utilisateur.email)) {
    errors.push('adresse email invalide')
  }

  if (
    !permissionCheck(utilisateur?.permissionId, [
      'admin',
      'editeur',
      'lecteur'
    ]) &&
    utilisateur.administrations &&
    utilisateur.administrations.length
  ) {
    errors.push(
      "les permissions de cet utilisateur ne permettent pas de l'associer à une administration"
    )
  }

  if (
    !permissionCheck(utilisateur?.permissionId, ['entreprise']) &&
    utilisateur.entreprises &&
    utilisateur.entreprises.length
  ) {
    errors.push(
      "les permissions de cet utilisateur ne permettent pas de l'associer à une entreprise"
    )
  }

  return errors
}

export { utilisateurEditionCheck }
