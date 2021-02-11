import { IUtilisateur, IFields } from '../../../types'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import Titres from '../../models/titres'
import Documents from '../../models/documents'
import TitresActivites from '../../models/titres-activites'
import DocumentsTypes from '../../models/documents-types'
import { documentsPermissionQueryBuild } from './documents'
// import fileCreate from '../../../tools/file-create'
// import { format } from 'sql-formatter'

const activiteStatuts = [
  {
    id: 'abs',
    name: 'activitesAbsentes'
  },
  {
    id: 'enc',
    name: 'activitesEnConstruction'
  },
  {
    id: 'dep',
    name: 'activitesDeposees'
  }
]

const titreActivitesCalc = (
  q: QueryBuilder<Titres, Titres | Titres[]>,
  fields?: { fields?: IFields },
  user?: IUtilisateur
) => {
  const activiteStatutsRequested = activiteStatuts.filter(
    activiteStatut =>
      fields && Object.keys(fields).includes(activiteStatut.name)
  )

  q.groupBy('titres.id')

  if (activiteStatutsRequested.length === 0) return q

  if (
    permissionCheck(user?.permissionId, [
      'super',
      'admin',
      'editeur',
      'lecteur',
      'entreprise'
    ])
  ) {
    const titresActivitesCountQuery = TitresActivites.query()
      .alias('activitesCount')
      .select('activitesCount.titreId')

    activiteStatutsRequested.forEach(({ id, name }) => {
      q.select(`activitesCountJoin.${name}`)

      titresActivitesCountQuery.select(
        raw('count(??) FILTER (WHERE ?? = ?)', [
          'activitesCount.statutId',
          'activitesCount.statutId',
          id
        ]).as(name)
      )
    })

    if (!permissionCheck(user?.permissionId, ['super'])) {
      if (
        permissionCheck(user?.permissionId, ['admin', 'editeur', 'lecteur']) &&
        user?.administrations?.length
      ) {
        const administrationsIds = user.administrations.map(e => e.id)

        // l'utilisateur fait partie d'une administrations qui a les droits sur l'activité
        titresActivitesCountQuery.whereExists(
          TitresActivites.query()
            .alias('titresActivitesAdministrations')
            .joinRelated('type.administrations')
            .whereRaw('?? = ??', [
              'titresActivitesAdministrations.id',
              'activitesCount.id'
            ])
            .whereIn('type:administrations.id', administrationsIds)
        )
      } else if (
        permissionCheck(user?.permissionId, ['entreprise']) &&
        user?.entreprises?.length
      ) {
        const entreprisesIds = user.entreprises.map(e => e.id)

        titresActivitesCountQuery.where(b => {
          b.whereExists(
            TitresActivites.query()
              .alias('titresActivitesTitulaires')
              .joinRelated('titre.titulaires')
              .whereRaw('?? = ??', [
                'titresActivitesTitulaires.id',
                'activitesCount.id'
              ])
              .whereIn('titre:titulaires.id', entreprisesIds)
          )
          b.orWhereExists(
            TitresActivites.query()
              .alias('titresActivitesAmodiataires')
              .joinRelated('titre.amodiataires')
              .whereRaw('?? = ??', [
                'titresActivitesAmodiataires.id',
                'activitesCount.id'
              ])
              .whereIn('titre:amodiataires.id', entreprisesIds)
          )
        })
      } else {
        titresActivitesCountQuery.where(false)
      }
    }

    titresActivitesCountQuery.groupBy('activitesCount.titreId')

    q.leftJoin(
      titresActivitesCountQuery.as('activitesCountJoin'),
      raw('?? = ??', ['activitesCountJoin.titreId', 'titres.id'])
    )
  } else if (!user || permissionCheck(user?.permissionId, ['defaut'])) {
    // les utilisateurs non-authentifiés ou défaut ne peuvent voir aucune activité
    activiteStatutsRequested.forEach(({ name }) => {
      q.select(raw('0').as(name))
    })
  }

  activiteStatuts.forEach(({ name }) => {
    q.groupBy(name)
  })

  return q
}

const titresActivitesAdministrationsQueryBuild = (
  administrationsIds: string[]
) =>
  TitresActivites.query()
    .alias('titresActivitesAdministrations')
    .joinRelated('type.administrations')
    .whereRaw('?? = ??', [
      'titresActivitesAdministrations.id',
      'titresActivites.id'
    ])
    .whereIn('type:administrations.id', administrationsIds)

// édition d'une activité
const titreActivitePermissionQueryBuild = (
  q: QueryBuilder<TitresActivites, TitresActivites | TitresActivites[]>,
  user?: IUtilisateur,
  grouped = false
) => {
  if (
    permissionCheck(user?.permissionId, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    const administrationsIds = user.administrations!.map(a => a.id)
    const titresActivitesAdministrationQuery = titresActivitesAdministrationsQueryBuild(
      administrationsIds
    )

    // l'utilisateur fait partie d'une administrations qui a les droits sur l'activité
    q.whereExists(titresActivitesAdministrationQuery)
  } else if (
    permissionCheck(user?.permissionId, ['entreprise']) &&
    user?.entreprises?.length
  ) {
    // vérifie que l'utilisateur a les permissions sur les titres
    const entreprisesIds = user.entreprises.map(e => e.id)

    const titulairesPermissionQuery = TitresActivites.query()
      .alias('titresActivitesTitulaires')
      .joinRelated('titre.titulaires')
      .whereRaw('?? = ??', [
        'titresActivitesTitulaires.id',
        'titresActivites.id'
      ])
      .whereIn('titre:titulaires.id', entreprisesIds)

    const amodiatairesPermissionQuery = TitresActivites.query()
      .alias('titresActivitesAmodiataires')
      .joinRelated('titre.amodiataires')
      .whereRaw('?? = ??', [
        'titresActivitesAmodiataires.id',
        'titresActivites.id'
      ])
      .whereIn('titre:amodiataires.id', entreprisesIds)

    q.where(b => {
      b.whereExists(titulairesPermissionQuery)
      b.orWhereExists(amodiatairesPermissionQuery)
    })
  } else if (!permissionCheck(user?.permissionId, ['super'])) {
    // sinon, aucune activité n'est visible
    q.where(false)
  }

  if (!grouped) {
    if (permissionCheck(user?.permissionId, ['super', 'admin', 'entreprise'])) {
      const documentsTypesQuery = DocumentsTypes.query()
        .alias('documentsTypesQuery')
        .select(raw('true'))
        .joinRelated('activitesTypes')
        .whereRaw('?? = ??', ['activitesTypes.id', 'titresActivites.typeId'])
        .groupBy('documentsTypesQuery.id')

      q.select(documentsTypesQuery.as('documentsCreation'))
    } else {
      q.select(raw('false').as('documentsCreation'))
    }
  }

  q.modifyGraph('documents', ed => {
    documentsPermissionQueryBuild(
      ed as QueryBuilder<Documents, Documents | Documents[]>,
      user
    )
  })

  return q
}

const titreActiviteQueryPropsBuild = (
  q: QueryBuilder<TitresActivites, TitresActivites | TitresActivites[]>,
  user?: IUtilisateur
) => {
  q.select('titresActivites.*')

  if (permissionCheck(user?.permissionId, ['super'])) {
    q.select(raw('true').as('modification'))
  } else if (
    permissionCheck(user?.permissionId, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    if (permissionCheck(user?.permissionId, ['admin', 'editeur'])) {
      const administrationsIds = user.administrations!.map(a => a.id)
      const titresActivitesAdministrationQuery = titresActivitesAdministrationsQueryBuild(
        administrationsIds
      )

      q.select(
        titresActivitesAdministrationQuery
          .select(raw('true'))
          // TODO: supprimer `_join` cf: https://github.com/Vincit/objection.js/issues/1883
          .where('type:administrations_join.modification', true)
          .as('modification')
      )
    } else {
      q.select(raw('false').as('modification'))
    }
  } else if (
    permissionCheck(user?.permissionId, ['entreprise']) &&
    user?.entreprises?.length
  ) {
    // vérifie que l'utilisateur a les droits d'édition sur l'activité
    // l'activité doit avoir un statut `absente ou `en cours`
    q.select(
      raw('(case when ?? in (?, ?) then true else false end)', [
        'titresActivites.statutId',
        'abs',
        'enc'
      ]).as('modification')
    )
  }

  if (!permissionCheck(user?.permissionId, ['super'])) {
    q.select(raw('false').as('suppression'))
  }

  // fileCreate('dev/tmp/titres-activites.sql', format(q.toKnexQuery().toString()))

  return q
}

export {
  titreActivitePermissionQueryBuild,
  titreActiviteQueryPropsBuild,
  titreActivitesCalc
}
