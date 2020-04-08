import { IUtilisateur } from '../../../types'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import TitresDocuments from '../../models/titres-documents'
import TitresEtapes from '../../models/titres-etapes'

import { titreDocumentsPermissionQueryBuild } from './titres-documents'
import { etapesTypesModificationQueryBuild } from './metas'

const titreEtapesPermissionQueryBuild = (
  q: QueryBuilder<TitresEtapes, TitresEtapes | TitresEtapes[]>,
  user?: IUtilisateur
) => {
  q.select('titresEtapes.*')

  // étapes visibles pour les admins
  if (user && permissionCheck(user, ['admin', 'editeur', 'lecteur'])) {
    q.joinRelated('[demarche.titre, type]')

    // si l'utilisateur admin n'appartient à aucune administration
    // alors il ne peut pas voir les étapes faisant l'objet de restriction
    // peu importe l'administration
    if (user.administrations?.length) {
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
        'r__titresTypes__etapesTypes__administrations as r_t_e_a',
        raw('?? = ?? AND ?? = ?? AND ?? = ??', [
          'r_t_e_a.etapeTypeId',
          'titresEtapes.typeId',
          'r_t_e_a.administrationId',
          'administrations.id',
          'r_t_e_a.titreTypeId',
          'demarche:titre.typeId'
        ])
      )

      q.whereRaw('?? is not true', ['r_t_e_a.lectureInterdit'])

      q.groupBy('titresEtapes.id')
    } else {
      q.leftJoinRelated('type.restrictionsAdministrations')

      q.whereNot({
        'type:restrictionsAdministrations.lectureInterdit': true
      }).andWhereRaw('?? = ??', [
        'type:restrictionsAdministrations.titreTypeId',
        'demarche:titre.typeId'
      ])
    }
  } else if (!user || permissionCheck(user, ['defaut', 'entreprise'])) {
    // étapes visibles pour les entreprises et utilisateurs déconnectés ou défaut

    q.leftJoinRelated('type.autorisations')

    q.where(b => {
      // visibilité des étapes en tant que titulaire ou amodiataire
      if (permissionCheck(user, ['entreprise'])) {
        b.orWhere('type:autorisations.entreprisesLecture', true)
      }

      // visibilité des étapes publiques
      b.orWhere('type:autorisations.publicLecture', true)
    })
  }

  if (permissionCheck(user, ['super'])) {
    q.select(raw('true').as('modification'))
    q.select(raw('true').as('suppression'))
  } else if (
    permissionCheck(user, ['admin', 'editeur']) &&
    user?.administrations?.length
  ) {
    const administrationsIds = user.administrations.map(a => a.id) || []

    if (administrationsIds.length) {
      // édition du titre

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
    } else {
      // si l'utilisateur admin n'appartient à aucune administration
      // il ne peut pas modifier / supprimer les étapes
      q.select(raw('false').as('modification'))
    }
    q.select(raw('false').as('suppression'))
  } else {
    q.select(raw('false').as('modification'))
    q.select(raw('false').as('suppression'))
  }

  q.modifyGraph('documents', td => {
    titreDocumentsPermissionQueryBuild(
      td as QueryBuilder<TitresDocuments, TitresDocuments | TitresDocuments[]>,
      user
    )
  })

  return q
}

export { titreEtapesPermissionQueryBuild }
