import { raw, QueryBuilder } from 'objection'

import { IUtilisateur } from '../../../types'

import { knex } from '../../../knex'

import { permissionCheck } from '../../../tools/permission'

import Administrations from '../../models/administrations'
import Utilisateurs from '../../models/utilisateurs'
import Titres from '../../models/titres'

import { titresQueryModify } from './titres'
import { utilisateursQueryModify } from './utilisateurs'
import Departements from '../../models/departements'

const administrationsQueryModify = (
  q: QueryBuilder<Administrations, Administrations | Administrations[]>,
  user: IUtilisateur | null
) => {
  q.select('administrations.*')

  // if (permissionCheck(user?.permissionId, ['super'])) {
  //   q.select(raw('true').as('modification'))
  // } else if (
  //   permissionCheck(user?.permissionId, ['admin', 'editeur', 'lecteur']) &&
  //   user?.administrations?.length
  // ) {
  //   // propriété 'membre'

  //   const administrationsIds = user.administrations.map(a => a.id) || []
  //   const administrationsIdsReplace = administrationsIds.map(() => '?')

  //   q.select(
  //     raw(
  //       `(case when ?? in (${administrationsIdsReplace}) then true else false end)`,
  //       ['administrations.id', ...administrationsIds]
  //     ).as('membre')
  //   )
  // }

  // Propriété "emailsModification" :
  // - Ministère peut tout modifier
  // - DREAL (admin, editeur) -> modifie eux memes et administrations subalternes sous leur contrôle
  // - Lecture : ministère peut tout lire, DREAL et administrations préfectoriales peuvent lire si lecteur.
  if (permissionCheck(user?.permissionId, ['super'])) {
    q.select(raw('true').as('emailsModification'))
  } else if (permissionCheck(user?.permissionId, ['admin', 'editeur'])) {
    if (user?.administrations?.some(a => a.typeId === 'min')) {
      q.select(raw('true').as('emailsModification'))
    } else {
      if (user?.administrations?.some(a => a.typeId === 'dre')) {
        q.select(
          Administrations.query()
            .select(raw('true'))
            .where('administrations.typeId', 'dre')
            .whereIn('administrations.id', user?.administrations?.map(a => a.id) || [])
            .as('emailsModification')
        )
      } else {
        q.select(
          Departements.query()
            .select(raw('true'))
            .leftJoin('administrations as adm', 'departements.regionId', 'adm.regionId')
            .where('departements.id', 'administrations.departementId')
            .whereIn('adm.id', user?.administrations?.map(a => a.id) || [])
            .as('emailsModification')
        )
      }
    }
  }

  // Propriété "emailsLecture"
  // if (permissionCheck(user?.permissionId, ['super', 'admin', 'editeur', 'lecteur'])) {
  //   q.select(raw('true').as('emailsLecture'))
  // }

  q.modifyGraph('gestionnaireTitres', a =>
    titresQueryModify(a as QueryBuilder<Titres, Titres | Titres[]>, user)
      // on group by administrationId au cas où il y a une aggrégation
      // dans la requête de titre (ex : calc activités)
      .groupBy(
        'titres.id',
        'titresAdministrationsGestionnaires.administrationId'
      )
  )

  q.modifyGraph('localeTitres', a =>
    titresQueryModify(a as QueryBuilder<Titres, Titres | Titres[]>, user)
      // on group by administrationId au cas où il y a une aggrégation
      // dans la requête de titre (ex : calc activités)
      .groupBy('titres.id', 'titresAdministrationsLocales.administrationId')
  )

  q.modifyGraph('utilisateurs', b => {
    utilisateursQueryModify(
      b as QueryBuilder<Utilisateurs, Utilisateurs | Utilisateurs[]>,
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
    b.andOn(knex.raw('?? = ??', ['a_tt.titreTypeId', `${titreAlias}.typeId`]))
    b.andOnIn('administrations.id', administrationsIds)
    if (isGestionnaire || isAssociee) {
      b.andOn(c => {
        if (isGestionnaire) {
          c.orOn(knex.raw('?? is true', ['a_tt.gestionnaire']))
        }
        if (isAssociee) {
          c.orOn(knex.raw('?? is true', ['a_tt.associee']))
        }
      })
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
    )
    b.onIn('t_al.administrationId', administrationsIds)
  })
}

const administrationsActivitesModify = (
  q: QueryBuilder<Administrations, Administrations | Administrations[]>,

  { lecture, modification }: { lecture?: boolean; modification?: boolean }
) => {
  q.leftJoin('administrations__activitesTypes as a_at', b => {
    b.on(knex.raw('?? = ??', ['a_at.administrationId', 'administrations.id']))
    b.andOn(
      knex.raw('?? = ??', ['a_at.activiteTypeId', 'titresActivites.typeId'])
    )
    b.andOn(c => {
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
    b.andOn(
      knex.raw('?? = ??', ['a_tt_ts.titreTypeId', `${titreAlias}.typeId`])
    )
    b.andOn(
      knex.raw('?? = ??', ['a_tt_ts.titreStatutId', `${titreAlias}.statutId`])
    )
    b.andOn(knex.raw('?? is true', [`a_tt_ts.${type}ModificationInterdit`]))
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
    b.andOn(knex.raw('?? = ??', ['a_tt_et.titreTypeId', titreTypeIdColumn]))
    b.andOn(knex.raw('?? = ??', ['a_tt_et.etapeTypeId', etapeTypeIdColumn]))
    b.andOn(knex.raw('?? is true', [`a_tt_et.${type}Interdit`]))
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
