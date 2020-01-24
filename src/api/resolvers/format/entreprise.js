import { titresFormat } from './titre'
import { utilisateursFormat } from './utilisateur'
import { permissionsCheck } from '../permissions/permissions-check'

const entrepriseFormat = (entreprise, user) => {
  entreprise.titresTitulaire = titresFormat(entreprise.titresTitulaire, user)
  entreprise.titresAmodiataire = titresFormat(
    entreprise.titresAmodiataire,
    user
  )
  entreprise.utilisateurs = utilisateursFormat(entreprise.utilisateurs, user)

  entreprise.editable = permissionsCheck(user, ['super', 'admin', 'editeur'])

  return entreprise
}

const entreprisesFormat = (entreprises, user) =>
  entreprises.map(entreprise => entrepriseFormat(entreprise, user))

export { entrepriseFormat, entreprisesFormat }
