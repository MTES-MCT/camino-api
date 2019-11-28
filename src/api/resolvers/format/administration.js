import { titresFormat } from './titre'
import { utilisateursFormat } from './utilisateur'

const administrationFormat = (administration, user) => {
  administration.titres = titresFormat(administration.titres, user)
  administration.utilisateurs = utilisateursFormat(
    administration.utilisateurs,
    user
  )

  return administration
}

const administrationsFormat = (administrations, user) =>
  administrations.map(administration =>
    administrationFormat(administration, user)
  )

export { administrationFormat, administrationsFormat }
