import { IUtilisateur } from '../../../types'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import {
  AutorisationsDomaines,
  AutorisationsTitresTypesAdministrations
} from '../../models/autorisations'
import Domaines from '../../models/domaines'
import TitresTypes from '../../models/titres-types'

const titresTypesPermissionsQueryBuild = (
  q: QueryBuilder<TitresTypes, TitresTypes | TitresTypes[]>,
  user?: IUtilisateur
) => {
  q.select('titresTypes.*')

  if (permissionCheck(user, ['super'])) {
    q.select(raw('true').as('titresModification'))
  } else if (
    permissionCheck(user, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    q.select(
      raw('(case when ?? is not null then true else false end)', [
        'titresTypesModification.id'
      ]).as('titresModification')
    )

    const administrationsIds = user.administrations.map(e => e.id)

    const titresTypesModificationQuery = TitresTypes.query()
      .select('titresTypes.id')
      // l'utilisateur fait partie d'une administrations
      // qui a les droits sur le type de titre
      .whereExists(
        AutorisationsTitresTypesAdministrations.query()
          .alias('tta')
          .whereRaw('?? = ??', ['tta.titreTypeId', 'titresTypes.id'])
          .whereIn('tta.administrationId', administrationsIds)
          .where('tta.gestionnaire', true)
      )

    q.leftJoin(
      titresTypesModificationQuery.as('titresTypesModification'),
      'titresTypesModification.id',
      'titresTypes.id'
    )
  } else {
    q.select(raw('false').as('titresModification'))
  }

  console.log(q.toKnexQuery().toString())
}

const domainesPermissionQueryBuild = (
  q: QueryBuilder<Domaines, Domaines | Domaines[]>,
  user?: IUtilisateur
) => {
  q.select('domaines.*')

  if (!user || permissionCheck(user, ['entreprise', 'defaut'])) {
    q.whereExists(
      (Domaines.relatedQuery('autorisation') as QueryBuilder<
        AutorisationsDomaines,
        AutorisationsDomaines | AutorisationsDomaines[]
      >).where({
        publicLecture: true
      })
    )
  }

  if (permissionCheck(user, ['super'])) {
    q.select(raw('true').as('titresModification'))
  } else if (
    permissionCheck(user, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    q.select(
      raw('(case when ?? is not null then true else false end)', [
        'domainesModification.domaineId'
      ]).as('titresModification')
    )

    const administrationsIds = user.administrations.map(e => e.id)

    const domainesModificationQuery = TitresTypes.query()
      .select('titresTypes.domaineId')
      // l'utilisateur fait partie d'une administrations
      // qui a les droits sur le type de titre
      .whereExists(
        AutorisationsTitresTypesAdministrations.query()
          .alias('tta')
          .whereRaw('?? = ??', ['tta.titreTypeId', 'titresTypes.id'])
          .whereIn('tta.administrationId', administrationsIds)
          .where('tta.gestionnaire', true)
      )
      .groupBy('titresTypes.domaineId')

    q.leftJoin(
      domainesModificationQuery.as('domainesModification'),
      'domainesModification.domaineId',
      'domaines.id'
    )
  } else {
    q.select(raw('false').as('titresModification'))
  }

  console.log(q.toKnexQuery().toString())

  q.modifyGraph('titresTypes', b => {
    titresTypesPermissionsQueryBuild(
      b as QueryBuilder<TitresTypes, TitresTypes | TitresTypes[]>,
      user
    )
  })
}

export { domainesPermissionQueryBuild, titresTypesPermissionsQueryBuild }
