import { titresFormat } from './titre'
import { utilisateursFormat } from './utilisateur'

const entrepriseFormat = (entreprise, user) => {
  entreprise.titresTitulaire = titresFormat(entreprise.titresTitulaire, user)
  entreprise.titresAmodiataire = titresFormat(
    entreprise.titresAmodiataire,
    user
  )
  entreprise.utilisateurs = utilisateursFormat(entreprise.utilisateurs, user)

  return entreprise
}

const entreprisesFormat = (entreprises, user) =>
  entreprises.map(entreprise => entrepriseFormat(entreprise, user))

export { entrepriseFormat, entreprisesFormat }
