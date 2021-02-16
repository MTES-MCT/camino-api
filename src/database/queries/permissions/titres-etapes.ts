import { IUtilisateur } from '../../../types'
// import * as sqlFormatter from 'sql-formatter'
// import fileCreate from '../../../tools/file-create'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import Documents from '../../models/documents'
import TitresEtapes from '../../models/titres-etapes'

import { documentsPermissionQueryBuild } from './documents'
import { etapesTypesModificationQueryBuild } from './metas'
import Titres from '../../models/titres'
import Administrations from '../../models/administrations'
import {
  administrationsTitresTypesEtapesTypesModifier,
  administrationsGestionnairesModifier,
  administrationsLocalesModifier
} from './administrations'

const titreEtapeModificationQueryBuild = (
  q: QueryBuilder<TitresEtapes, TitresEtapes | TitresEtapes[]>,
  user?: IUtilisateur
) => {
  if (permissionCheck(user?.permissionId, ['super'])) {
    q.select(raw('true').as('modification'))
  } else if (
    permissionCheck(user?.permissionId, ['admin', 'editeur']) &&
    user?.administrations?.length
  ) {
    const administrationsIds = user.administrations.map(a => a.id) || []
    // édition de l'étape
    // propriété 'modification'
    // types d'étape autorisés pour tous les titres et démarches
    // sur lesquels l'utilisateur a des droits
    const etapeModificationQuery = etapesTypesModificationQueryBuild(
      administrationsIds,
      'modification'
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
  } else {
    q.select(raw('false').as('modification'))
  }
}

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
        Administrations.query()
          .modify(
            administrationsGestionnairesModifier,
            administrationsIds,
            'demarche:titre'
          )
          .modify(
            administrationsLocalesModifier,
            administrationsIds,
            'demarche:titre'
          )
          .modify(
            administrationsTitresTypesEtapesTypesModifier,
            'lecture',
            'demarche:titre.typeId',
            'titresEtapes.typeId'
          )
          .whereIn('administrations.id', administrationsIds)
          .where(c => {
            c.orWhereNotNull('a_tt.administrationId').orWhereNotNull(
              't_al.administrationId'
            )
          })
      )
    } else if (
      user?.entreprises?.length &&
      permissionCheck(user?.permissionId, ['entreprise'])
    ) {
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
    q.select(raw('true').as('suppression'))
    q.select(raw('type.fondamentale').as('justificatifsAssociation'))
  } else if (
    permissionCheck(user?.permissionId, ['admin', 'editeur']) &&
    user?.administrations?.length
  ) {
    q.select(raw('false').as('suppression'))

    q.select(
      raw('?? is true', ['type.fondamentale']).as('justificatifsAssociation')
    )
  } else {
    q.select(raw('false').as('suppression'))
    q.select(raw('false').as('justificatifsAssociation'))
  }

  titreEtapeModificationQueryBuild(q, user)

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

  // fileCreate('test-5.sql', sqlFormatter.format(q.toKnexQuery().toString()))

  return q
}

export { titreEtapesPermissionQueryBuild, titreEtapeModificationQueryBuild }
