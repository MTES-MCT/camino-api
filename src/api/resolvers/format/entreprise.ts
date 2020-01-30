import { IEntreprises, IUtilisateurs } from '../../../types'

import { titresFormat } from './titre'
import { utilisateursFormat } from './utilisateur'
import { permissionsCheck } from '../permissions/permissions-check'

const entrepriseFormat = (entreprise: IEntreprises, user: IUtilisateurs) => {
  entreprise.titresTitulaire =
    entreprise.titresTitulaire && titresFormat(entreprise.titresTitulaire, user)

  entreprise.titresAmodiataire =
    entreprise.titresAmodiataire &&
    titresFormat(entreprise.titresAmodiataire, user)

  entreprise.utilisateurs =
    entreprise.utilisateurs && utilisateursFormat(entreprise.utilisateurs, user)

  entreprise.editable = permissionsCheck(user, ['super', 'admin', 'editeur'])

  return entreprise
}

const entreprisesFormat = (entreprises: IEntreprises[], user: IUtilisateurs) =>
  entreprises.map(entreprise => entrepriseFormat(entreprise, user))

export { entrepriseFormat, entreprisesFormat }
