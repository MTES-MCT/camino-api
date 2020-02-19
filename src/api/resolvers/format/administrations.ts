import { IAdministration, IUtilisateur } from '../../../types'

import { titresFormat } from './titres'
import { utilisateursFormat } from './utilisateurs'
import { permissionsAdministrationsCheck } from '../permissions/permissions-check'

const administrationFormat = (
  user: IUtilisateur | undefined,
  administration: IAdministration
) => {
  administration.titresAdministrationsGestionnaires =
    administration.titresAdministrationsGestionnaires &&
    titresFormat(user, administration.titresAdministrationsGestionnaires)

  administration.titresAdministrationsLocales =
    administration.titresAdministrationsLocales &&
    titresFormat(user, administration.titresAdministrationsLocales)

  administration.utilisateurs =
    administration.utilisateurs &&
    utilisateursFormat(user, administration.utilisateurs)

  const isMembre = permissionsAdministrationsCheck(
    user,
    [administration.id]
  )
  if (isMembre) {
    administration.membre = isMembre
  }

  return administration
}

const administrationsFormat = (
  user: IUtilisateur | undefined,
  administrations: IAdministration[]
) =>
  administrations.map(administration =>
    administrationFormat(user, administration)
  )

export { administrationFormat, administrationsFormat }
