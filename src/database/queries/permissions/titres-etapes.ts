import { IUtilisateur } from '../../../types'
import { format } from 'sql-formatter'
import fileCreate from '../../../tools/file-create'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import Documents from '../../models/documents'
import TitresEtapes from '../../models/titres-etapes'

import { documentsPermissionQueryBuild } from './documents'
import { etapesTypesModificationQueryBuild } from './metas'
import Titres from '../../models/titres'

/**
 * Modifie la requête d'étape(s) pour prendre en compte les permissions de l'utilisateur connecté
 *
 * @params q - requête d'étape(s)
 * @params user - utilisateur connecté
 * @returns une requête d'étape(s)
 */
const titreEtapesPermissionQueryBuild = (
  q: QueryBuilder<TitresEtapes, TitresEtapes | TitresEtapes[]>,
  user?: IUtilisateur
) => {
  q.select('titresEtapes.*').leftJoinRelated('type')

  q.where(b => {
    b.orWhere('type.publicLecture', true)

    // étapes visibles pour les admins
    if (
      user?.administrations?.length &&
      permissionCheck(user.permissionId, ['admin', 'editeur', 'lecteur'])
    ) {
      q.leftJoinRelated('[demarche.titre]')

      // si l'utilisateur appartient à une administration
      // alors il peut voir les étapes faisant l'objet d'aucune restriction

      const administrationsIds = user.administrations.map(a => a.id)
      const administrationsIdsReplace = administrationsIds.map(() => '?')

      // il faut le faire avant le join du graph
      // pour avoir autant de lignes que d'administrations de l'utilisateur
      q.leftJoin(
        'administrations',
        raw(`?? in (${administrationsIdsReplace})`, [
          'administrations.id',
          ...administrationsIds
        ])
      )

      q.leftJoin(
        'administrations__titresTypes__etapesTypes as a_tt_et',
        raw('?? = ?? AND ?? = ?? AND ?? = ??', [
          'a_tt_et.etapeTypeId',
          'titresEtapes.typeId',
          'a_tt_et.administrationId',
          'administrations.id',
          'a_tt_et.titreTypeId',
          'demarche:titre.typeId'
        ])
      )

      b.orWhereRaw('?? is not true', ['a_tt_et.lectureInterdit'])

      // le group by permet de réduire les doublons causés par les left join
      b.groupBy('titresEtapes.id')
    } else if (
      user?.entreprises?.length &&
      permissionCheck(user?.permissionId, ['entreprise'])
    ) {
      q.leftJoinRelated('[demarche.titre]')

      // si l'utilisateur appartient à une administration
      // alors il peut voir les étapes faisant l'objet d'aucune restriction

      const entreprisesIds = user.entreprises.map(a => a.id)

      b.orWhere(c => {
        c.where('type.entreprisesLecture', true).where(d => {
          d.whereExists(
            Titres.query()
              .alias('titulaireTitres')
              .joinRelated('titulaires')
              .whereRaw('?? = ??', ['titulaireTitres.id', 'demarche:titre.id'])
              .whereIn('titulaires.id', entreprisesIds)
          )
          d.orWhereExists(
            Titres.query()
              .alias('amodiataireTitres')
              .joinRelated('amodiataires')
              .whereRaw('?? = ??', [
                'amodiataireTitres.id',
                'demarche:titre.id'
              ])
              .whereIn('amodiataires.id', entreprisesIds)
          )
        })
      })
    }
  })

  if (permissionCheck(user?.permissionId, ['super'])) {
    q.select(raw('true').as('modification'))
    q.select(raw('true').as('suppression'))

    q.leftJoinRelated('type')
    q.select(raw('type.fondamentale').as('justificatifsAssociation'))
  } else if (
    permissionCheck(user?.permissionId, ['admin', 'editeur']) &&
    user?.administrations?.length
  ) {
    // édition de l'étape

    // propriété 'modification'
    // types d'étape autorisés pour tous les titres et démarches
    // sur lesquels l'utilisateur a des droits
    const etapeModificationQuery = etapesTypesModificationQueryBuild(
      user.administrations,
      true
    )
      // filtre selon la démarche
      .whereRaw('?? = ??', [
        'demarchesModification.id',
        'titresEtapes.titreDemarcheId'
      ])
      // filtre selon le type de l'étape
      .whereRaw('?? = ??', ['t_d_e.etapeTypeId', 'titresEtapes.typeId'])

    // TODO: conditionner aux fields
    q.select(etapeModificationQuery.as('modification'))
    q.select(raw('false').as('suppression'))

    const justificatifsAssociationQuery = etapeModificationQuery.clone()

    q.leftJoinRelated('type')
    justificatifsAssociationQuery.where(
      raw('?? is true', ['type.fondamentale'])
    )

    q.groupBy('type.fondamentale')

    q.select(justificatifsAssociationQuery.as('justificatifsAssociation'))
  } else {
    q.select(raw('false').as('modification'))
    q.select(raw('false').as('suppression'))
    q.select(raw('false').as('justificatifsAssociation'))
  }

  q.modifyGraph('documents', ed => {
    documentsPermissionQueryBuild(
      ed as QueryBuilder<Documents, Documents | Documents[]>,
      user
    )
  })

  q.modifyGraph('justificatifs', ed => {
    documentsPermissionQueryBuild(
      ed as QueryBuilder<Documents, Documents | Documents[]>,
      user
    )
  })

  fileCreate('test.sql', format(q.toKnexQuery().toString()))

  return q
}

export { titreEtapesPermissionQueryBuild }
