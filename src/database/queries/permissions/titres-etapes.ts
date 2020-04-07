import { IUtilisateur } from '../../../types'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import { AutorisationsTitresTypesAdministrations } from '../../models/autorisations'
import Administrations from '../../models/administrations'
import TitresDocuments from '../../models/titres-documents'
import TitresEtapes from '../../models/titres-etapes'

import { titreDocumentsPermissionQueryBuild } from './titres-documents'

const titreEtapesPermissionQueryBuild = (
  q: QueryBuilder<TitresEtapes, TitresEtapes | TitresEtapes[]>,
  user?: IUtilisateur
) => {
  console.log('titreEtapePermissionQueryBuild')

  q.select('titresEtapes.*')

  if (
    permissionCheck(user, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    const administrationsIds = user.administrations.map(a => a.id) || []

    q.joinRelated('[demarche.titre, type]')

    // si l'utilisateur admin n'appartient à aucune administration
    // alors il ne peut pas voir les étapes faisant l'objet de restriction
    // peu importe l'administration
    if (administrationsIds.length === 0) {
      q.leftJoinRelated('type.restrictionsAdministrations')

      q.whereNot({
        'type:restrictionsAdministrations.lectureInterdit': true
      }).andWhereRaw('?? = ??', [
        'type:restrictionsAdministrations.titreTypeId',
        'demarche:titre.typeId'
      ])
    } else {
      // il faut le faire avant le join du graph
      // pour avoir autant de lignes que d'administrations de l'utilisateur
      q.leftJoin(
        'administrations',
        raw(`?? in (${administrationsIds.map(() => '?').join(',')})`, [
          'administrations.id',
          ...administrationsIds
        ])
      )

      q.leftJoin(
        'r__titresTypes__etapesTypes__administrations as type:restrictionsAdministrations',
        raw('?? = ?? AND ?? = ?? AND ?? = ??', [
          'type:restrictionsAdministrations.etapeTypeId',
          'titresEtapes.typeId',
          'type:restrictionsAdministrations.administrationId',
          'administrations.id',
          'type:restrictionsAdministrations.titreTypeId',
          'demarche:titre.typeId'
        ])
      )

      q.whereRaw('?? is not true', [
        'type:restrictionsAdministrations.lectureInterdit'
      ])

      q.groupBy('titresEtapes.id')
    }
  } else {
    if (!user || permissionCheck(user, ['defaut', 'entreprise'])) {
      q.leftJoinRelated('type.autorisations')

      if (permissionCheck(user, ['entreprise'])) {
        // visibilité des étapes en tant que titulaire ou amodiataire
        q.where('type:autorisations.entreprisesLecture', true)
      } else {
        // visibilité des étapes publiques
        q.where('type:autorisations.publicLecture', true)
      }
    }
  }

  if (permissionCheck(user, ['super'])) {
    q.select(raw('true').as('modification'))
    q.select(raw('true').as('suppression'))
  } else if (
    permissionCheck(user, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    const administrationsIds = user.administrations.map(a => a.id) || []

    // si l'utilisateur admin n'appartient à aucune administration
    // il ne peut pas modifier / supprimer les étapes
    if (administrationsIds.length === 0) {
      q.select(raw('false').as('modification'))
      q.select(raw('false').as('suppression'))
    } else {
      // édition du titre
      q.select(
        raw('(case when ?? is not null then true else false end)', [
          'titresModification.id'
        ]).as('modification')
      )

      const titresModificationQuery = TitresEtapes.query()
        .joinRelated('demarche.titre')
        .select('demarche:titre.id')
        // l'utilisateur fait partie d'une administrations
        // qui a les droits sur le type de titre
        .whereExists(
          AutorisationsTitresTypesAdministrations.query()
            .whereIn(
              'a__titresTypes__administrations.administrationId',
              administrationsIds
            )
            .andWhereRaw(`?? = ??`, [
              'a__titresTypes__administrations.titreTypeId',
              'demarche:titre.typeId'
            ])
        )
        // l'utilisateur est dans au moins une administration
        // qui n'a pas de restriction 'demarchesModificationInterdit' sur ce type / statut de titre
        .whereExists(
          Administrations.query()
            .leftJoin(
              'r__titresTypes__titresStatuts__administrations',
              raw('?? = ?? and ?? = ?? and ?? = ?? and ?? is true', [
                'r__titresTypes__titresStatuts__administrations.administrationId',
                'administrations.id',
                'r__titresTypes__titresStatuts__administrations.titreTypeId',
                'demarche:titre.typeId',
                'r__titresTypes__titresStatuts__administrations.titreStatutId',
                'demarche:titre.statutId',
                'r__titresTypes__titresStatuts__administrations.demarchesModificationInterdit'
              ])
            )
            .whereIn('administrations.id', administrationsIds)
            .whereNull(
              'r__titresTypes__titresStatuts__administrations.administrationId'
            )
        )
        // l'utilisateur est dans au moins une administration
        // qui n'a pas de restriction 'creationInterdit' sur ce type d'étape / type de titre
        .whereExists(
          Administrations.query()
            .leftJoin(
              'r__titresTypes__etapesTypes__administrations',
              raw('?? = ?? and ?? = ?? and ?? = ?? and ?? = true', [
                'r__titresTypes__etapesTypes__administrations.administrationId',
                'administrations.id',
                'r__titresTypes__etapesTypes__administrations.titreTypeId',
                'demarche:titre.typeId',
                'r__titresTypes__etapesTypes__administrations.etapeTypeId',
                'titresEtapes.id',
                'r__titresTypes__etapesTypes__administrations.creationInterdit'
              ])
            )
            .whereIn('administrations.id', administrationsIds)
            .whereNull(
              'r__titresTypes__etapesTypes__administrations.administrationId'
            )
        )

      q.leftJoin(
        titresModificationQuery.as('titresModification'),
        raw('?? = ??', ['titresModification.id', 'demarche.titreId'])
      )

      q.groupBy('titresModification.id')
    }
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

  // fileCreate(
  //   'tmp/titres-etapes.sql',
  //   sqlFormatter.format(q.toKnexQuery().toString())
  // )

  return q
}

export { titreEtapesPermissionQueryBuild }
