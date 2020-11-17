import { IAdministration, IFields, IUtilisateur } from '../../../types'

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

const administrationsGestionnairesModifier = (
  q: QueryBuilder<Administrations, Administrations | Administrations[]>,
  administrations: IAdministration[]
) => {
  const administrationsIds = administrations.map(a => a.id) || []
  const administrationsIdsReplace = administrationsIds.map(() => '?')

  q.leftJoin(
    'administrations__titresTypes as a_tt',
    raw(
      `?? = ?? and ?? = ?? and ?? = true and ?? in (${administrationsIdsReplace})`,
      [
        'a_tt.administrationId',
        'administrations.id',
        'a_tt.titreTypeId',
        'titresModification.typeId',
        'a_tt.gestionnaire',
        'administrations.id',
        ...administrationsIds
      ]
    )
  )
}

const administrationsLocalesModifier = (
  q: QueryBuilder<Administrations, Administrations | Administrations[]>,
  administrations: IAdministration[]
) => {
  const administrationsIds = administrations.map(a => a.id) || []
  const administrationsIdsReplace = administrationsIds.map(() => '?')

  q.leftJoin(
    'titresAdministrationsLocales as t_al',
    raw(`?? = ?? and ?? in (${administrationsIdsReplace})`, [
      'titresModification.administrationsTitreEtapeId',
      't_al.titreEtapeId',
      't_al.administrationId',
      ...administrationsIds
    ])
  )
}

const administrationsTitresTypesModifier = (
  q: QueryBuilder<Administrations, Administrations | Administrations[]>,
  type: 'titres' | 'demarches' | 'etapes'
) => {
  q.leftJoin(
    'administrations__titresTypes__titresStatuts as a_tt_ts',
    raw('?? = ?? and ?? = ?? and ?? = ?? and ?? is true', [
      'a_tt_ts.administrationId',
      'administrations.id',
      'a_tt_ts.titreTypeId',
      'titresModification.typeId',
      'a_tt_ts.titreStatutId',
      'titresModification.statutId',
      `a_tt_ts.${type}ModificationInterdit`
    ])
  ).whereNull('a_tt_ts.administrationId')
}

// l'utilisateur est dans au moins une administration
// qui n'a pas de restriction 'creationInterdit' sur ce type d'étape / type de titre
const administrationsEtapesTypesModifier = (
  q: QueryBuilder<Administrations, Administrations | Administrations[]>,
  modification: boolean
) => {
  q.leftJoin(
    'administrations__titresTypes__etapesTypes as a_tt_et',
    raw('?? = ?? and ?? = ?? and ?? = ?? and ?? = true', [
      'a_tt_et.administrationId',
      'administrations.id',
      'a_tt_et.titreTypeId',
      't_d_e.titreTypeId',
      'a_tt_et.etapeTypeId',
      't_d_e.etapeTypeId',
      `a_tt_et.${modification ? 'modification' : 'creation'}Interdit`
    ])
  ).whereNull('a_tt_et.administrationId')
}

export {
  administrationsPermissionQueryBuild,
  administrationsGestionnairesModifier,
  administrationsLocalesModifier,
  administrationsTitresTypesModifier,
  administrationsEtapesTypesModifier
}
