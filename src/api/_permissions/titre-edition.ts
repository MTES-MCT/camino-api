import { IUtilisateur } from '../../types'

import { permissionCheck } from '../../tools/permission'
import { titresAdministrationsModificationQuery } from '../../database/queries/permissions/titres'
import { etapesTypesModificationQueryBuild } from '../../database/queries/permissions/metas'

type EditionType = 'titres' | 'demarches' | 'etapes'
type EditionMode = 'creation' | 'modification'

// TODO à bouger dans src/database/queries/permissions/metas.ts

/**
 * Vérifie que l'administration a les droits de modification sur le titre/démarche/étape
 * du type de titre au statut donné
 * @param user - utilisateur
 * @param titreTypeId - type du titre
 * @param titreStatutId - statut du titre
 * @param type - type de modification souhaitée
 */
const titreTypeStatutPermissionAdministrationCheck = async (
  user: IUtilisateur,
  titreTypeId: string,
  titreStatutId: string,
  type: EditionType
) => {
  if (user && permissionCheck(user.permissionId, ['super'])) {
    return true
  }

  if (!user?.administrations?.length) {
    return false
  }

  const administrationsIds = user.administrations.map(a => a.id) || []

  const titresModifiables = await titresAdministrationsModificationQuery(
    administrationsIds,
    type
  )
    .andWhereRaw('?? = ?', ['titresModification.typeId', titreTypeId])
    .andWhereRaw('?? = ?', ['titresModification.statutId', titreStatutId])

  if (titresModifiables.length) {
    return true
  }

  return false
}

const titreEtapePermissionAdministrationsCheck = async (
  user: IUtilisateur | undefined,
  titreId: string,
  etapeTypeId: string,
  etapeMode: EditionMode
) => {
  if (user && permissionCheck(user.permissionId, ['super'])) {
    return true
  }

  if (!user?.administrations?.length) {
    return false
  }

  // vérifie que l'administration a les droits d'édition
  // sur les étapes du titre au statut donné

  const administrationsIds = user.administrations.map(a => a.id) || []

  const etapesTypesModifiables = await etapesTypesModificationQueryBuild(
    administrationsIds,
    etapeMode === 'modification' ? 'modification' : 'creation'
  )
    .whereRaw('?? = ?', ['titresModification.id', titreId])
    .whereRaw('?? = ?', ['t_d_e.etapeTypeId', etapeTypeId])
    .groupBy('titresModification.typeId')

  if (etapesTypesModifiables.length) {
    return true
  }

  return false
}

export {
  titreTypeStatutPermissionAdministrationCheck,
  titreEtapePermissionAdministrationsCheck
}
