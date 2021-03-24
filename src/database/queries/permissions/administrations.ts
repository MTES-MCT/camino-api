import { IFields, IUtilisateur } from '../../../types'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import Administrations from '../../models/administrations'
import Utilisateurs from '../../models/utilisateurs'
import Titres from '../../models/titres'

import { titresQueryModify } from './titres'
import { utilisateursQueryModify } from './utilisateurs'
import { knex } from '../../../knex'

const administrationsQueryModify = (
  q: QueryBuilder<Administrations, Administrations | Administrations[]>,
  { fields }: { fields?: IFields },
  user: IUtilisateur | null
) => {
  q.select('administrations.*')

  if (permissionCheck(user?.permissionId, ['super'])) {
    q.select(raw('true').as('modification'))
  } else if (
    permissionCheck(user?.permissionId, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    // propriété 'membre'

    const administrationsIds = user.administrations.map(a => a.id) || []
    const administrationsIdsReplace = administrationsIds.map(() => '?')

    q.select(
      raw(
        `(case when ?? in (${administrationsIdsReplace}) then true else false end)`,
        ['administrations.id', ...administrationsIds]
      ).as('membre')
    )
  }

  q.modifyGraph('gestionnaireTitres', a =>
    titresQueryModify(
      a as QueryBuilder<Titres, Titres | Titres[]>,
      { fields },
      user
    )
      // on group by administrationId au cas où il y a une aggrégation
      // dans la requête de titre (ex : calc activités)
      .groupBy(
        'titres.id',
        'titresAdministrationsGestionnaires.administrationId'
      )
  )

  q.modifyGraph('localeTitres', a =>
    titresQueryModify(
      a as QueryBuilder<Titres, Titres | Titres[]>,
      { fields },
      user
    )
      // on group by administrationId au cas où il y a une aggrégation
      // dans la requête de titre (ex : calc activités)
      .groupBy('titres.id', 'titresAdministrationsLocales.administrationId')
  )

  q.modifyGraph('utilisateurs', b => {
    utilisateursQueryModify(
      b as QueryBuilder<Utilisateurs, Utilisateurs | Utilisateurs[]>,
      { fields },
      user
    )
  })

  return q
}

const administrationsTitresTypesModify = (
  q: QueryBuilder<Administrations, Administrations | Administrations[]>,
  administrationsIds: string[],
  titreAlias: string,
  {
    isGestionnaire,
    isAssociee
  }: { isGestionnaire?: boolean; isAssociee?: boolean } = {}
) => {
  q.leftJoin('administrations__titresTypes as a_tt', b => {
    b.on(knex.raw('?? = ??', ['a_tt.administrationId', 'administrations.id']))
      .andOn(knex.raw('?? = ??', ['a_tt.titreTypeId', `${titreAlias}.typeId`]))
      .onIn('administrations.id', administrationsIds)
    if (isGestionnaire && isAssociee) {
      b.on(knex.raw('( ?? is true', ['a_tt.gestionnaire']))
      b.orOn(knex.raw('?? is true )', ['a_tt.associee']))
    } else if (isGestionnaire) {
      b.on(knex.raw('?? is true', ['a_tt.gestionnaire']))
    } else if (isAssociee) {
      b.on(knex.raw('?? is true', ['a_tt.associee']))
    }
  })
}

const administrationsLocalesModify = (
  q: QueryBuilder<Administrations, Administrations | Administrations[]>,
  administrationsIds: string[],
  titreAlias: string
) => {
  q.leftJoin('titresAdministrationsLocales as t_al', b => {
    b.on(
      knex.raw('?? ->> ? = ??', [
        `${titreAlias}.propsTitreEtapesIds`,
        'administrations',
        't_al.titreEtapeId'
      ])
    ).onIn('t_al.administrationId', administrationsIds)
  })
}

const administrationsActivitesModify = (
  q: QueryBuilder<Administrations, Administrations | Administrations[]>,

  { lecture, modification }: { lecture?: boolean; modification?: boolean }
) => {
  q.leftJoin('administrations__activitesTypes as a_at', b => {
    b.on(knex.raw('?? = ??', ['a_at.administrationId', 'administrations.id']))
      .andOn(
        knex.raw('?? = ??', ['a_at.activiteTypeId', 'titresActivites.typeId'])
      )
      .andOn(c => {
        if (lecture) {
          c.orOn(knex.raw('?? is true', ['a_at.lectureInterdit']))
        }
        if (modification) {
          c.orOn(knex.raw('?? is true', ['a_at.modificationInterdit']))
        }
      })
  })
  q.whereNull('a_at.administrationId')
}

const administrationsTitresQuery = (
  administrationsIds: string[],
  titreAlias: string,
  {
    isGestionnaire,
    isAssociee,
    isLocale
  }: { isGestionnaire?: boolean; isAssociee?: boolean; isLocale?: boolean } = {}
) => {
  const q = Administrations.query().whereIn(
    'administrations.id',
    administrationsIds
  )

  if (isGestionnaire || isAssociee) {
    q.modify(administrationsTitresTypesModify, administrationsIds, titreAlias, {
      isGestionnaire,
      isAssociee
    })
  }

  if (isLocale) {
    q.modify(administrationsLocalesModify, administrationsIds, titreAlias)
  }

  q.where(c => {
    if (isGestionnaire || isAssociee) {
      c.orWhereNotNull('a_tt.administrationId')
    }

    if (isLocale) {
      c.orWhereNotNull('t_al.administrationId')
    }
  })

  return q
}

const administrationsTitresTypesTitresStatutsModify = (
  q: QueryBuilder<Administrations, Administrations | Administrations[]>,
  type: 'titres' | 'demarches' | 'etapes',
  titreAlias: string
) => {
  q.leftJoin('administrations__titresTypes__titresStatuts as a_tt_ts', b => {
    b.on(
      knex.raw('?? = ??', ['a_tt_ts.administrationId', 'administrations.id'])
    )
      .andOn(
        knex.raw('?? = ??', ['a_tt_ts.titreTypeId', `${titreAlias}.typeId`])
      )
      .andOn(
        knex.raw('?? = ??', ['a_tt_ts.titreStatutId', `${titreAlias}.statutId`])
      )
      .andOn(knex.raw('?? is true', [`a_tt_ts.${type}ModificationInterdit`]))
  }).whereNull('a_tt_ts.administrationId')
}

// l'utilisateur est dans au moins une administration
// qui n'a pas de restriction 'creationInterdit' sur ce type d'étape / type de titre
const administrationsTitresTypesEtapesTypesModify = (
  q: QueryBuilder<Administrations, Administrations | Administrations[]>,
  type: 'lecture' | 'modification' | 'creation',
  titreTypeIdColumn: string,
  etapeTypeIdColumn: string
) => {
  q.leftJoin('administrations__titresTypes__etapesTypes as a_tt_et', b => {
    b.on(
      knex.raw('?? = ??', ['a_tt_et.administrationId', 'administrations.id'])
    )
      .andOn(knex.raw('?? = ??', ['a_tt_et.titreTypeId', titreTypeIdColumn]))
      .andOn(knex.raw('?? = ??', ['a_tt_et.etapeTypeId', etapeTypeIdColumn]))
      .andOn(knex.raw('?? is true', [`a_tt_et.${type}Interdit`]))
  }).whereNull('a_tt_et.administrationId')
}

export {
  administrationsQueryModify,
  administrationsLocalesModify,
  administrationsTitresTypesTitresStatutsModify,
  administrationsTitresTypesEtapesTypesModify,
  administrationsTitresQuery,
  administrationsActivitesModify
}
