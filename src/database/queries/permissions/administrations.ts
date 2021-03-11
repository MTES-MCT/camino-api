import { IFields, IUtilisateur } from '../../../types'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import Administrations from '../../models/administrations'
import Utilisateurs from '../../models/utilisateurs'
import Titres from '../../models/titres'

import { titrePermissionQueryBuild } from './titres'
import { utilisateursPermissionQueryBuild } from './utilisateurs'

const administrationsPermissionQueryBuild = (
  q: QueryBuilder<Administrations, Administrations | Administrations[]>,
  fields?: IFields,
  user?: IUtilisateur
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
    titrePermissionQueryBuild(
      a as QueryBuilder<Titres, Titres | Titres[]>,
      fields,
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
    titrePermissionQueryBuild(
      a as QueryBuilder<Titres, Titres | Titres[]>,
      fields,
      user
    )
      // on group by administrationId au cas où il y a une aggrégation
      // dans la requête de titre (ex : calc activités)
      .groupBy('titres.id', 'titresAdministrationsLocales.administrationId')
  )

  q.modifyGraph('utilisateurs', u =>
    utilisateursPermissionQueryBuild(
      u as QueryBuilder<Utilisateurs, Utilisateurs | Utilisateurs[]>,
      fields,
      user
    )
  )

  return q
}

const administrationsTitresTypesModifier = (
  q: QueryBuilder<Administrations, Administrations | Administrations[]>,
  administrationsIds: string[],
  titreAlias: string,
  {
    isGestionnaire,
    isAssociee
  }: { isGestionnaire?: boolean; isAssociee?: boolean } = {}
) => {
  const administrationsIdsReplace = administrationsIds.map(() => '?').join(',')

  let query = `?? = ?? and ?? = ?? and ?? in (${administrationsIdsReplace})`

  const bindings = [
    'a_tt.administrationId',
    'administrations.id',
    'a_tt.titreTypeId',
    `${titreAlias}.typeId`,
    'administrations.id',
    ...administrationsIds
  ]

  if (isGestionnaire) {
    query = `${query} and ${isAssociee ? '(' : ''} ?? is true`
    bindings.push('a_tt.gestionnaire')
  }

  if (isAssociee) {
    query = `${query} ${isGestionnaire ? 'or' : 'and'} ?? is true ${
      isGestionnaire ? ')' : ''
    }`
    bindings.push('a_tt.associee')
  }

  q.leftJoin('administrations__titresTypes as a_tt', raw(query, bindings))
}

const administrationsLocalesModifier = (
  q: QueryBuilder<Administrations, Administrations | Administrations[]>,
  administrationsIds: string[],
  titreAlias: string
) => {
  const administrationsIdsReplace = administrationsIds.map(() => '?').join(',')

  q.leftJoin(
    'titresAdministrationsLocales as t_al',
    raw(`?? ->> ? = ?? and ?? in (${administrationsIdsReplace})`, [
      `${titreAlias}.propsTitreEtapesIds`,
      'administrations',
      't_al.titreEtapeId',
      't_al.administrationId',
      ...administrationsIds
    ])
  )
}

const administrationsActivitesModifier = (
  q: QueryBuilder<Administrations, Administrations | Administrations[]>,

  { lecture, modification }: { lecture?: boolean; modification?: boolean }
) => {
  let query = '?? = ?? and ?? = ??'
  const bindings = [
    'a_at.administrationId',
    'administrations.id',
    'a_at.activiteTypeId',
    'titresActivites.typeId'
  ]

  if (lecture) {
    query = `${query} and ?? is not true`
    bindings.push('a_at.lectureInterdit')
  }

  if (modification) {
    query = `${query} and ?? is not true`
    bindings.push('a_at.modificationInterdit')
  }

  q.leftJoin('administrations__activitesTypes as a_at', raw(query, bindings))
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
    q.modify(
      administrationsTitresTypesModifier,
      administrationsIds,
      titreAlias,
      { isGestionnaire, isAssociee }
    )
  }

  if (isLocale) {
    q.modify(administrationsLocalesModifier, administrationsIds, titreAlias)
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

const administrationsTitresTypesTitresStatutsModifier = (
  q: QueryBuilder<Administrations, Administrations | Administrations[]>,
  type: 'titres' | 'demarches' | 'etapes',
  titreAlias: string
) => {
  q.leftJoin(
    'administrations__titresTypes__titresStatuts as a_tt_ts',
    raw('?? = ?? and ?? = ?? and ?? = ?? and ?? is true', [
      'a_tt_ts.administrationId',
      'administrations.id',
      'a_tt_ts.titreTypeId',
      `${titreAlias}.typeId`,
      'a_tt_ts.titreStatutId',
      `${titreAlias}.statutId`,
      `a_tt_ts.${type}ModificationInterdit`
    ])
  ).whereNull('a_tt_ts.administrationId')
}

// l'utilisateur est dans au moins une administration
// qui n'a pas de restriction 'creationInterdit' sur ce type d'étape / type de titre
const administrationsTitresTypesEtapesTypesModifier = (
  q: QueryBuilder<Administrations, Administrations | Administrations[]>,
  type: 'lecture' | 'modification' | 'creation',
  titreTypeIdColumn: string,
  etapeTypeIdColumn: string
) => {
  q.leftJoin(
    'administrations__titresTypes__etapesTypes as a_tt_et',
    raw('?? = ?? and ?? = ?? and ?? = ?? and ?? is true', [
      'a_tt_et.administrationId',
      'administrations.id',
      'a_tt_et.titreTypeId',
      titreTypeIdColumn,
      'a_tt_et.etapeTypeId',
      etapeTypeIdColumn,
      `a_tt_et.${type}Interdit`
    ])
  ).whereNull('a_tt_et.administrationId')
}

export {
  administrationsPermissionQueryBuild,
  administrationsLocalesModifier,
  administrationsTitresTypesTitresStatutsModifier,
  administrationsTitresTypesEtapesTypesModifier,
  administrationsTitresQuery,
  administrationsActivitesModifier
}
