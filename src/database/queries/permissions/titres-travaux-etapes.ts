import { IUtilisateur } from '../../../types'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import Documents from '../../models/documents'
import TitresTravauxEtapes from '../../models/titres-travaux-etapes'

import { documentsQueryModify } from './documents'
import { administrationsTitresQuery } from './administrations'
import { entreprisesTitresQuery } from './entreprises'
import { titreTravauxModificationQuery } from './titres-travaux'

/**
 * Modifie la requête d'étape(s) pour prendre en compte les permissions de l'utilisateur connecté
 *
 * @params q - requête d'étape(s)
 * @params user - utilisateur connecté
 * @returns une requête d'étape(s)
 */
const titresTravauxEtapesQueryModify = (
  q: QueryBuilder<
    TitresTravauxEtapes,
    TitresTravauxEtapes | TitresTravauxEtapes[]
  >,
  user?: IUtilisateur
) => {
  q.select('titresTravauxEtapes.*').leftJoinRelated('[travaux.titre]')

  if (!user || !permissionCheck(user.permissionId, ['super'])) {
    q.where(b => {
      // étapes visibles pour les admins
      if (
        user?.administrations?.length &&
        permissionCheck(user.permissionId, ['admin', 'editeur', 'lecteur'])
      ) {
        const administrationsIds = user.administrations.map(a => a.id) || []

        b.orWhereExists(
          administrationsTitresQuery(administrationsIds, 'travaux:titre', {
            isGestionnaire: true,
            isAssociee: true,
            isLocale: true
          })
        )
      } else if (
        user?.entreprises?.length &&
        permissionCheck(user?.permissionId, ['entreprise'])
      ) {
        const entreprisesIds = user.entreprises.map(a => a.id)

        b.orWhere(c => {
          c.where('type.entreprisesLecture', true)

          c.whereExists(
            entreprisesTitresQuery(entreprisesIds, 'travaux:titre', {
              isTitulaire: true,
              isAmodiataire: true
            })
          )
        })
      }
    })
  }

  q.select(
    raw(permissionCheck(user?.permissionId, ['super']) ? 'true' : 'false').as(
      'suppression'
    )
  )

  q.select(
    titreTravauxModificationQuery('travaux', 'travaux:titre', user).as(
      'modification'
    )
  )

  q.modifyGraph('documents', b => {
    documentsQueryModify(
      b as QueryBuilder<Documents, Documents | Documents[]>,
      user
    )
  })

  return q
}

export { titresTravauxEtapesQueryModify }
