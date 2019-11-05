import { titresFormat } from './_titre-format'
import { utilisateursFormat } from './_utilisateur'

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
