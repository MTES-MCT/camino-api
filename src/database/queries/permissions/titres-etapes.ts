import { IUtilisateur } from '../../../types'
// import * as sqlFormatter from 'sql-formatter'
// import fileCreate from '../../../tools/file-create'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import Documents from '../../models/documents'
import TitresEtapes from '../../models/titres-etapes'

import { documentsQueryModify } from './documents'
import { etapesTypesModificationQueryBuild } from './metas'
import {
  administrationsTitresTypesEtapesTypesModify,
  administrationsTitresQuery
} from './administrations'
import { entreprisesTitresQuery } from './entreprises'

const titreEtapeModificationQueryBuild = (user?: IUtilisateur) => {
  if (permissionCheck(user?.permissionId, ['super'])) {
    return raw('true')
  } else if (
    permissionCheck(user?.permissionId, ['admin', 'editeur']) &&
    user?.administrations?.length
  ) {
    const administrationsIds = user.administrations.map(a => a.id) || []

    return (
      etapesTypesModificationQueryBuild(administrationsIds, 'modification')
        .whereRaw('?? = ??', [
          'demarchesModification.id',
          'titresEtapes.titreDemarcheId'
        ])
        // filtre selon le type de l'étape
        .whereRaw('?? = ??', ['t_d_e.etapeTypeId', 'titresEtapes.typeId'])
    )
  }

  return raw('false')
}

/**
 * Modifie la requête d'étape(s) pour prendre en compte les permissions de l'utilisateur connecté
 *
 * @params q - requête d'étape(s)
 * @params user - utilisateur connecté
 * @returns une requête d'étape(s)
 */
const titresEtapesQueryModify = (
  q: QueryBuilder<TitresEtapes, TitresEtapes | TitresEtapes[]>,
  user?: IUtilisateur
) => {
  q.select('titresEtapes.*').leftJoinRelated('[demarche.titre, type]')

  q.where(b => {
    if (!user || !permissionCheck(user.permissionId, ['super'])) {
      b.orWhere('type.publicLecture', true)
    }

    // étapes visibles pour les admins
    if (
      user?.administrations?.length &&
      permissionCheck(user.permissionId, ['admin', 'editeur', 'lecteur'])
    ) {
      // si l'utilisateur appartient à une administration
      // alors il peut voir les étapes faisant l'objet d'aucune restriction

      const administrationsIds = user.administrations.map(a => a.id) || []

      b.orWhereExists(
        administrationsTitresQuery(administrationsIds, 'demarche:titre', {
          isGestionnaire: true,
          isAssociee: true,
          isLocale: true
        }).modify(
          administrationsTitresTypesEtapesTypesModify,
          'lecture',
          'demarche:titre.typeId',
          'titresEtapes.typeId'
        )
      )
    } else if (
      user?.entreprises?.length &&
      permissionCheck(user?.permissionId, ['entreprise'])
    ) {
      // si l'utilisateur appartient à une administration
      // alors il peut voir les étapes faisant l'objet d'aucune restriction

      const entreprisesIds = user.entreprises.map(a => a.id)

      b.orWhere(c => {
        c.where('type.entreprisesLecture', true)

        c.whereExists(
          entreprisesTitresQuery(entreprisesIds, 'demarche:titre', {
            isTitulaire: true,
            isAmodiataire: true
          })
        )
      })
    }
  })

  q.select(
    raw(
      permissionCheck(user?.permissionId, ['super', 'admin', 'editeur'])
        ? 'type.fondamentale'
        : 'false'
    ).as('justificatifsAssociation')
  )

  q.select(
    raw(permissionCheck(user?.permissionId, ['super']) ? 'true' : 'false').as(
      'suppression'
    )
  )

  q.select(titreEtapeModificationQueryBuild(user).as('modification'))

  q.modifyGraph('documents', b => {
    documentsQueryModify(
      b as QueryBuilder<Documents, Documents | Documents[]>,
      user
    )
  })

  q.modifyGraph('justificatifs', b => {
    documentsQueryModify(
      b as QueryBuilder<Documents, Documents | Documents[]>,
      user
    )
  })

  // fileCreate('test-5.sql', sqlFormatter.format(q.toKnexQuery().toString()))

  return q
}

export { titresEtapesQueryModify }
