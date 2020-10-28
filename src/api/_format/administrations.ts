import { IAdministration, IUtilisateur } from '../../types'

import { titresFormat } from './titres'
import { utilisateurFormat } from './utilisateurs'

/**
 * Formate une administration en fonction du profil de l'utilisateur
 *
 * @param user - Utilisateur
 * @param administration - Administration à formater
 * @returns Une administration formatée
 *
 */

const administrationFormat = (
  user: IUtilisateur | undefined,
  administration: IAdministration
) => {
  administration.gestionnaireTitres =
    administration.gestionnaireTitres &&
    titresFormat(user, administration.gestionnaireTitres)

  administration.localeTitres =
    administration.localeTitres &&
    titresFormat(user, administration.localeTitres)

  administration.utilisateurs = administration.utilisateurs?.map(
    utilisateurFormat
  )

  return administration
}

export { administrationFormat }
