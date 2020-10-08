import { IUtilisateur } from '../../types'

import { permissionCheck } from '../../tools/permission'
import { titresModificationQueryBuild } from '../../database/queries/permissions/titres'
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
  return (
    user &&
    (permissionCheck(user.permissionId, ['super']) ||
      (user.administrations?.length &&
        (
          await titresModificationQueryBuild(user.administrations, type)
            .andWhereRaw('?? = ?', ['titresModification.typeId', titreTypeId])
            .andWhereRaw('?? = ?', [
              'titresModification.statutId',
              titreStatutId
            ])
        ).length))
  )
}

const titreEtapePermissionAdministrationsCheck = async (
  user: IUtilisateur | undefined,
  titreId: string,
  etapeTypeId: string,
  etapeMode: EditionMode
) =>
  user &&
  (permissionCheck(user?.permissionId, ['super']) ||
    (user.administrations?.length &&
      // vérifie que l'administration a les droits d'édition
      // sur les étapes du titre au statut donné
      (
        await etapesTypesModificationQueryBuild(
          user.administrations,
          etapeMode === 'modification'
        )
          .whereRaw('?? = ?', ['titresModification.id', titreId])
          .whereRaw('?? = ?', ['t_d_e.etapeTypeId', etapeTypeId])
          .groupBy('titresModification.typeId')
      ).length))

export {
  titreTypeStatutPermissionAdministrationCheck,
  titreEtapePermissionAdministrationsCheck
}
