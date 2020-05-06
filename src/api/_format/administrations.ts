import { IAdministration, IUtilisateur } from '../../types'

import { titresFormat } from './titres'
import { utilisateurFormat } from './utilisateurs'

const administrationFormat = (
  user: IUtilisateur | undefined,
  administration: IAdministration
) => {
  administration.titresAdministrationGestionnaire =
    administration.titresAdministrationGestionnaire &&
    titresFormat(user, administration.titresAdministrationGestionnaire)

  administration.titresAdministrationLocale =
    administration.titresAdministrationLocale &&
    titresFormat(user, administration.titresAdministrationLocale)

  administration.utilisateurs = administration.utilisateurs?.map(
    utilisateurFormat
  )

  return administration
}

export { administrationFormat }
