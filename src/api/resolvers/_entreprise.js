import { titresFormat } from './_titre-format'
import { utilisateursFormat } from './_utilisateur'

const entrepriseFormat = (entreprise, user) => {
  entreprise.titres = titresFormat(entreprise.titres, user)
  entreprise.utilisateurs = utilisateursFormat(entreprise.utilisateurs, user)

  return entreprise
}

const entreprisesFormat = (entreprises, user) =>
  entreprises.map(entreprise => entrepriseFormat(entreprise, user))

export { entrepriseFormat, entreprisesFormat }
