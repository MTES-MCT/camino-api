import { IUtilisateur } from '../../../types'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import Titres from '../../models/titres'
import TitresActivites from '../../models/titres-activites'
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
  user?: IUtilisateur
) => {
  if (
    permissionCheck(user, [
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

    activiteStatuts.forEach(({ id, name }) => {
      q.select(`activitesCountJoin.${name}`)

      titresActivitesCountQuery.select(
        raw('count(??) FILTER (WHERE ?? = ?)', [
          'activitesCount.statutId',
          'activitesCount.statutId',
          id
        ]).as(name)
      )
    })

    if (!permissionCheck(user, ['super'])) {
      if (
        permissionCheck(user, ['admin', 'editeur', 'lecteur']) &&
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
        permissionCheck(user, ['entreprise']) &&
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
  } else if (!user || permissionCheck(user, ['defaut'])) {
    // les utilisateurs non-authentifiés ou défaut ne peuvent voir aucune activité
    activiteStatuts.forEach(({ name }) => {
      q.select(raw('0').as(name))
    })
  }

  q.groupBy('titres.id')

  activiteStatuts.forEach(({ name }) => {
    q.groupBy(name)
  })

  return q
}

// édition d'une activité
const titreActivitePermissionQueryBuild = (
  q: QueryBuilder<TitresActivites, TitresActivites | TitresActivites[]>,
  user?: IUtilisateur
) => {
  if (!permissionCheck(user, ['super'])) {
    if (
      permissionCheck(user, ['admin', 'editeur']) &&
      user?.administrations?.length
    ) {
      // TODO: autoriser les admins 'lecteur' pour les cas particuliers

      const administrationsIds = user.administrations!.map(a => a.id) || []

      // l'utilisateur fait partie d'une administrations qui a les droits sur l'activité
      q.whereExists(
        TitresActivites.query()
          .alias('titresActivitesAdministrations')
          .joinRelated('type.administrations')
          .whereRaw('?? = ??', [
            'titresActivitesAdministrations.id',
            'titresActivites.id'
          ])
          .whereIn('type:administrations.id', administrationsIds)
      )
    } else if (
      permissionCheck(user, ['entreprise']) &&
      user?.entreprises?.length
    ) {
      // vérifie que l'utilisateur a les permissions sur les titres
      const entreprisesIds = user.entreprises.map(e => e.id)

      q.where(b => {
        b.whereExists(
          TitresActivites.query()
            .alias('titresActivitesTitulaires')
            .joinRelated('titre.titulaires')
            .whereRaw('?? = ??', [
              'titresActivitesTitulaires.id',
              'titresActivites.id'
            ])
            .whereIn('titre:titulaires.id', entreprisesIds)
        )
        b.orWhereExists(
          TitresActivites.query()
            .alias('titresActivitesAmodiataires')
            .joinRelated('titre.amodiataires')
            .whereRaw('?? = ??', [
              'titresActivitesAmodiataires.id',
              'titresActivites.id'
            ])
            .whereIn('titre:amodiataires.id', entreprisesIds)
        )
      })
    } else {
      // sinon, aucune activité n'est visible
      q.where(false)
    }
  }

  return q
}

const titreActiviteQueryPropsBuild = (
  q: QueryBuilder<TitresActivites, TitresActivites | TitresActivites[]>,
  user?: IUtilisateur
) => {
  q.select('titresActivites.*')

  if (permissionCheck(user, ['super'])) {
    q.select(raw('true').as('modification'))
  } else if (permissionCheck(user, ['admin', 'editeur', 'lecteur'])) {
    if (permissionCheck(user, ['admin', 'editeur'])) {
      q.select(raw('true').as('modification'))
    } else {
      q.select(raw('false').as('modification'))
    }
  } else if (permissionCheck(user, ['entreprise'])) {
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

  // fileCreate('dev/tmp/titres-activites.sql', format(q.toKnexQuery().toString()))

  return q
}

export {
  titreActivitePermissionQueryBuild,
  titreActiviteQueryPropsBuild,
  titreActivitesCalc
}
