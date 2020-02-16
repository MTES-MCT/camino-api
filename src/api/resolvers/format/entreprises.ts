import { IEntreprise, IUtilisateur } from '../../../types'

import { titresFormat } from './titres'
import { utilisateursFormat } from './utilisateurs'
import { permissionsCheck } from '../permissions/permissions-check'

const entrepriseFormat = (
  user: IUtilisateur | undefined,
  entreprise: IEntreprise
) => {
  entreprise.titresTitulaire =
    entreprise.titresTitulaire && titresFormat(user, entreprise.titresTitulaire)

  entreprise.titresAmodiataire =
    entreprise.titresAmodiataire &&
    titresFormat(user, entreprise.titresAmodiataire)

  entreprise.utilisateurs =
    entreprise.utilisateurs && utilisateursFormat(user, entreprise.utilisateurs)

  entreprise.editable = permissionsCheck(user, ['super', 'admin', 'editeur'])

  return entreprise
}

const entreprisesFormat = (
  user: IUtilisateur | undefined,
  entreprises: IEntreprise[]
) => entreprises.map(entreprise => entrepriseFormat(user, entreprise))

export { entrepriseFormat, entreprisesFormat }
