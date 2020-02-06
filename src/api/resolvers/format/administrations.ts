import { IAdministrations, IUtilisateurs } from '../../../types'

import { titresFormat } from './titres'
import { utilisateursFormat } from './utilisateurs'

const administrationFormat = (
  administration: IAdministrations,
  user: IUtilisateurs
) => {
  administration.titresAdministrationsGestionnaires =
    administration.titresAdministrationsGestionnaires &&
    titresFormat(administration.titresAdministrationsGestionnaires, user)

  administration.titresAdministrationsLocales =
    administration.titresAdministrationsLocales &&
    titresFormat(administration.titresAdministrationsLocales, user)

  administration.utilisateurs =
    administration.utilisateurs &&
    utilisateursFormat(administration.utilisateurs, user)

  return administration
}

const administrationsFormat = (
  administrations: IAdministrations[],
  user: IUtilisateurs
) =>
  administrations.map(administration =>
    administrationFormat(administration, user)
  )

export { administrationFormat, administrationsFormat }
