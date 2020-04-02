import { IAdministration, IUtilisateur } from '../../../types'

import { titresFormat } from './titres'
import { utilisateurFormat } from './utilisateurs'
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

  administration.utilisateurs = administration.utilisateurs?.map(
    utilisateurFormat
  )

  const isMembre = permissionsAdministrationsCheck(user, [administration.id])
  if (isMembre) {
    administration.membre = isMembre
  }

  return administration
}

export { administrationFormat }
