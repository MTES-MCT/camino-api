import { IUtilisateur } from '../../../types'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import Titres from '../../models/titres'
import TitresDemarches from '../../models/titres-demarches'
import TitresActivites from '../../models/titres-activites'

import {
  AutorisationsDomaines,
  AutorisationsTitresTypesTitresStatuts,
  AutorisationsTitresTypesAdministrations,
  RestrictionsTitresTypesTitresStatutsAdministrations
} from '../../models/autorisations'
import Entreprises from '../../models/entreprises'

import {
  titreActivitesCalc,
  titreActivitePermissionQueryBuild
} from './titres-activites'
import { titreDemarchePermissionQueryBuild } from './titres-demarches'

const titrePermissionQueryBuild = (
  q: QueryBuilder<Titres, Titres | Titres[]>,
  user?: IUtilisateur
) => {
  console.log('titrePermissionQueryBuild')

  q.select('titres.*')

  if (!user || permissionCheck(user, ['entreprise', 'defaut'])) {
    q.where(b => {
      b.orWhere(c => {
        // titres publics
        c.whereExists(
          AutorisationsDomaines.query().whereRaw('?? = ?? and ?? = ?', [
            'a__domaines.domaineId',
            'titres.domaineId',
            'a__domaines.publicLecture',
            true
          ])
        )

        c.whereExists(
          AutorisationsTitresTypesTitresStatuts.query().whereRaw(
            '?? = ?? and ?? = ?? and ?? = ?',
            [
              'a__titresTypes__titresStatuts.titreTypeId',
              'titres.typeId',
              'a__titresTypes__titresStatuts.titreStatutId',
              'titres.statutId',
              'a__titresTypes__titresStatuts.publicLecture',
              true
            ]
          )
        )
      })

      if (permissionCheck(user, ['entreprise']) && user?.entreprises?.length) {
        // si l'utilisateur est `entreprise`,
        // titres dont il est titulaire ou amodiataire
        const entreprisesIds = user.entreprises.map(e => e.id)

        b.orWhere(c => {
          c.orWhereExists(
            (Titres.relatedQuery('titulaires') as QueryBuilder<
              Entreprises,
              Entreprises | Entreprises[]
            >).whereIn('titulaires.id', entreprisesIds)
          )
          c.orWhereExists(
            (Titres.relatedQuery('amodiataires') as QueryBuilder<
              Entreprises,
              Entreprises | Entreprises[]
            >).whereIn('amodiataires.id', entreprisesIds)
          )
        })
      }
    })
  }

  if (permissionCheck(user, ['super'])) {
    q.select(raw('true').as('modification'))
    q.select(raw('true').as('suppression'))
  } else if (
    permissionCheck(user, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    q.select(
      raw('(case when ?? is not null then true else false end)', [
        'titresModification.id'
      ]).as('modification')
    )

    const administrationsIds = user.administrations.map(a => a.id) || []

    const titresModificationQuery = Titres.query()
      .alias('titresModification')
      .select('titresModification.id')
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
            'titresModification.typeId'
          ])
      )
      .whereNotExists(
        RestrictionsTitresTypesTitresStatutsAdministrations.query()
          .whereIn(
            'r__titresTypes__titresStatuts__administrations.administrationId',
            administrationsIds
          )
          .andWhereRaw(`?? = ??`, [
            'r__titresTypes__titresStatuts__administrations.titreTypeId',
            'titresModification.typeId'
          ])
          .andWhereRaw(`?? = ??`, [
            'r__titresTypes__titresStatuts__administrations.titreStatutId',
            'titresModification.statutId'
          ])
          .andWhere(
            'r__titresTypes__titresStatuts__administrations.titresModificationInterdit',
            true
          )
      )

    q.leftJoin(
      titresModificationQuery.as('titresModification'),
      raw('?? = ??', ['titresModification.id', 'titres.id'])
    )
  } else {
    q.select(raw('false').as('modification'))
    q.select(raw('false').as('suppression'))
  }

  // TODO: conditionner aux fields
  titreActivitesCalc(q, user)

  // visibilité des étapes
  q.modifyGraph('demarches', b => {
    titreDemarchePermissionQueryBuild(
      b as QueryBuilder<TitresDemarches, TitresDemarches | TitresDemarches[]>,
      user
    )
  })

  // visibilité des activités
  q.modifyGraph('activites', b => {
    titreActivitePermissionQueryBuild(
      b as QueryBuilder<TitresActivites, TitresActivites | TitresActivites[]>,
      user
    )
  })

  q.modifyGraph('administrationsGestionnaires', b => {
    b.whereRaw('?? is not true', ['associee'])
  })

  q.modifyGraph('administrationsLocales', b => {
    b.whereRaw('?? is not true', ['associee'])
  })

  // fileCreate('tmp/titres.sql', sqlFormatter.format(q.toKnexQuery().toString()))

  return q
}

export { titrePermissionQueryBuild }
