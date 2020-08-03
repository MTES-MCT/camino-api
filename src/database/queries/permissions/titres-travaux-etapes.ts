import { IUtilisateur } from '../../../types'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import Documents from '../../models/documents'
import TitresTravauxEtapes from '../../models/titres-travaux-etapes'

import { documentsPermissionQueryBuild } from './documents'

/**
 * Modifie la requête d'étape(s) pour prendre en compte les permissions de l'utilisateur connecté
 *
 * @params q - requête d'étape(s)
 * @params user - utilisateur connecté
 * @returns une requête d'étape(s)
 */
const titreTravauxEtapesPermissionQueryBuild = (
  q: QueryBuilder<
    TitresTravauxEtapes,
    TitresTravauxEtapes | TitresTravauxEtapes[]
  >,
  user?: IUtilisateur
) => {
  q.select('titresTravauxEtapes.*')

  if (permissionCheck(user?.permissionId, ['super'])) {
    q.select(raw('true').as('modification'))
    q.select(raw('true').as('suppression'))
  } else {
    q.select(raw('false').as('modification'))
    q.select(raw('false').as('suppression'))
  }

  q.modifyGraph('documents', ed => {
    documentsPermissionQueryBuild(
      ed as QueryBuilder<Documents, Documents | Documents[]>,
      user
    )
  })

  return q
}

export { titreTravauxEtapesPermissionQueryBuild }
