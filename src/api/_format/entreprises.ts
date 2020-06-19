import { IEntreprise, IUtilisateur } from '../../types'

import { titresFormat } from './titres'
import { utilisateurFormat } from './utilisateurs'

/**
 * Formate une entreprise en fonction du profil de l'utilisateur
 *
 * @param user - Utilisateur
 * @param administration - Entreprise à formater
 * @returns Une entreprise formatée
 *
 */

const entrepriseFormat = (
  user: IUtilisateur | undefined,
  entreprise: IEntreprise
) => {
  entreprise.titresTitulaire =
    entreprise.titresTitulaire && titresFormat(user, entreprise.titresTitulaire)

  entreprise.titresAmodiataire =
    entreprise.titresAmodiataire &&
    titresFormat(user, entreprise.titresAmodiataire)

  entreprise.utilisateurs = entreprise.utilisateurs?.map(utilisateurFormat)

  return entreprise
}

export { entrepriseFormat }
