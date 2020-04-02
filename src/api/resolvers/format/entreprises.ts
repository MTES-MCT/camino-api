import { IEntreprise, IUtilisateur } from '../../../types'

import { titresFormat } from './titres'
import { utilisateurFormat } from './utilisateurs'

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
