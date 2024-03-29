import { raw, QueryBuilder } from 'objection'

import { IUtilisateur } from '../../../types'

import { knex } from '../../../knex'
// import fileCreate from '../../../tools/file-create'
// import { format } from 'sql-formatter'

import { permissionCheck } from '../../../business/permission'

import AdministrationsTitresTypes from '../../models/administrations-titres-types'
import Domaines from '../../models/domaines'
import TitresTypes from '../../models/titres-types'
import DemarchesTypes from '../../models/demarches-types'
import EtapesTypes from '../../models/etapes-types'
import TitresEtapes from '../../models/titres-etapes'
import TitresTypesDemarchesTypesEtapesTypes from '../../models/titres-types--demarches-types-etapes-types'
import TitresActivites from '../../models/titres-activites'
import ActivitesTypes from '../../models/activites-types'
import Permissions from '../../models/permissions'

import { titresDemarchesAdministrationsModificationQuery } from './titres'
import {
  administrationsTitresTypesTitresStatutsModify,
  administrationsTitresTypesEtapesTypesModify,
  administrationsTitresQuery
} from './administrations'

// récupère les types d'étapes qui ont
// - les autorisations sur le titre
// - pas de restrictions sur le type d'étape
// -> retourne un booléen pour chaque ligne contenant :
// - 'titresModification.id': id du titre sur lequel l'utilisateur a des droits
// - 'demarchesModification.id': id de la démarche
// - 't_d_e.etapeTypeId': id du type d'étape'
const administrationsEtapesTypesPropsQuery = (
  administrationsIds: string[],
  type: 'modification' | 'creation'
) =>
  TitresTypesDemarchesTypesEtapesTypes.query()
    .alias('t_d_e')
    .select(raw('true'))
    .leftJoin(
      'titres as titresModification',
      raw('?? = ??', ['t_d_e.titreTypeId', 'titresModification.typeId'])
    )
    .leftJoin('titresDemarches as demarchesModification', b => {
      b.on(
        knex.raw('?? = ??', [
          'demarchesModification.typeId',
          't_d_e.demarcheTypeId'
        ])
      ).andOn(
        knex.raw('?? = ??', [
          'demarchesModification.titreId',
          'titresModification.id'
        ])
      )
    })
    .whereExists(
      administrationsTitresQuery(administrationsIds, 'titresModification', {
        isGestionnaire: true,
        isLocale: true
      })
        .modify(
          administrationsTitresTypesTitresStatutsModify,
          'etapes',
          'titresModification'
        )
        .modify(
          administrationsTitresTypesEtapesTypesModify,
          type,
          't_d_e.titreTypeId',
          't_d_e.etapeTypeId'
        )
    )

const entreprisesEtapesTypesPropsQuery = (entreprisesIds: string[]) =>
  TitresEtapes.query()
    .alias('e_te')
    .select(raw('true'))
    .leftJoinRelated('titulaires.titresTypes')
    .leftJoinRelated('demarche.titre')
    .andWhere('demarche.typeId', 'oct')
    .andWhere('e_te.typeId', 'mfr')
    .andWhere('e_te.statutId', 'aco')
    .whereIn('titulaires.id', entreprisesIds)
    .whereRaw('?? = ??', ['demarche:titre.typeId', 'titulaires:titresTypes.id'])
    .whereRaw('?? is true', ['titulaires:titresTypesJoin.titresCreation'])
    .first()

const titresCreationQuery = (administrationsIds: string[]) =>
  AdministrationsTitresTypes.query()
    .alias('a_tt')
    .select(raw('true'))
    .whereIn('a_tt.administrationId', administrationsIds)
    .where('a_tt.gestionnaire', true)

const titresTypesQueryModify = (
  q: QueryBuilder<TitresTypes, TitresTypes | TitresTypes[]>,
  user: IUtilisateur | null | undefined
) => {
  q.select('titresTypes.*')

  if (permissionCheck(user?.permissionId, ['super'])) {
    q.select(raw('true').as('titresCreation'))
  } else if (
    permissionCheck(user?.permissionId, ['admin', 'editeur']) &&
    user?.administrations?.length
  ) {
    const administrationsIds = user.administrations.map(e => e.id)

    q.select(
      titresCreationQuery(administrationsIds)
        .as('titresCreation')
        .whereRaw('?? = ??', ['a_tt.titreTypeId', `titresTypes.id`])
    )
  } else {
    q.select(raw('false').as('titresCreation'))
  }
}

const domainesQueryModify = (
  q: QueryBuilder<Domaines, Domaines | Domaines[] | undefined>,
  user: IUtilisateur | null | undefined
) => {
  q.select('domaines.*')

  q.modifyGraph('titresTypes', b => {
    titresTypesQueryModify(
      b as QueryBuilder<TitresTypes, TitresTypes | TitresTypes[]>,
      user
    )
  })
}

const etapesTypesQueryModify = (
  q: QueryBuilder<EtapesTypes, EtapesTypes | EtapesTypes[]>,
  user: IUtilisateur | null | undefined,
  {
    titreDemarcheId,
    titreEtapeId,
    uniqueCheck
  }: {
    titreDemarcheId?: string
    titreEtapeId?: string
    uniqueCheck?: boolean
  } = { uniqueCheck: true }
) => {
  q.select('etapesTypes.*')

  // si titreDemarcheId
  // -> restreint aux types d'étapes du type de la démarche

  if (titreDemarcheId) {
    q.leftJoin(
      'titresDemarches as td',
      raw('?? = ?', ['td.id', titreDemarcheId])
    )
    q.leftJoin('titres as t', 't.id', 'td.titreId')
    q.leftJoin('titresTypes__demarchesTypes__etapesTypes as tde', b => {
      b.on(knex.raw('?? = ??', ['tde.etapeTypeId', 'etapesTypes.id']))
      b.andOn(knex.raw('?? = ??', ['tde.demarcheTypeId', 'td.typeId']))
      b.andOn(knex.raw('?? = ??', ['tde.titreTypeId', 't.typeId']))
    })

    q.andWhereRaw('?? is not null', ['tde.titre_type_id'])
    q.orderBy('tde.ordre')

    // si
    // - l'étape n'est pas unique
    // - ou si
    //   - il n'y a aucune étape du même type au sein de la démarche
    //   - l'id de l'étape est différente de l'étape éditée
    // -> affiche le type d'étape
    if (uniqueCheck) {
      q.where(b => {
        b.whereRaw('?? is not true', ['etapesTypes.unique'])
        b.orWhere(c => {
          const d = TitresEtapes.query()
            .where({ titreDemarcheId })
            .whereRaw('?? = ??', ['typeId', 'etapesTypes.id'])

          if (titreEtapeId) {
            d.whereNot('id', titreEtapeId)
          }

          c.whereNotExists(d)
        })
      })
    }
  }

  // types d'étapes visibles pour les entreprises et utilisateurs déconnectés ou défaut
  if (!user || permissionCheck(user?.permissionId, ['defaut', 'entreprise'])) {
    q.where(b => {
      // types d'étapes visibles en tant que titulaire ou amodiataire
      if (permissionCheck(user?.permissionId, ['entreprise'])) {
        b.orWhere('td.entreprisesLecture', true)
      }

      // types d'étapes publiques
      b.orWhere('td.publicLecture', true)
    })
  }

  // propriété 'etapesCreation' en fonction du profil de l'utilisateur
  if (permissionCheck(user?.permissionId, ['super'])) {
    q.select(raw('true').as('etapesCreation'))
  } else if (
    permissionCheck(user?.permissionId, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    if (titreDemarcheId) {
      const administrationsIds = user.administrations.map(a => a.id) || []

      const etapesCreationQuery = administrationsEtapesTypesPropsQuery(
        administrationsIds,
        titreEtapeId ? 'modification' : 'creation'
      )
        .where('demarchesModification.id', titreDemarcheId)
        .whereRaw('?? = ??', ['t_d_e.etapeTypeId', 'etapesTypes.id'])

      q.select(etapesCreationQuery.as('etapesCreation'))
    } else {
      q.select(raw('false').as('etapesCreation'))
    }
  } else if (permissionCheck(user?.permissionId, ['entreprise'])) {
    if (titreEtapeId && user?.entreprises?.length) {
      const etapesCreationQuery = entreprisesEtapesTypesPropsQuery(
        user.entreprises.map(({ id }) => id)
      )
        .andWhere('e_te.id', titreEtapeId)
        .andWhereRaw('?? = ??', ['e_te.typeId', 'etapesTypes.id'])

      q.select(etapesCreationQuery.as('etapesCreation'))
    } else {
      q.select(raw('false').as('etapesCreation'))
    }
  } else {
    q.select(raw('false').as('etapesCreation'))
  }

  // fileCreate('dev/tmp/etapes-types.sql', format(q.toKnexQuery().toString()))
}

const activitesTypesQueryModify = (
  q: QueryBuilder<ActivitesTypes, ActivitesTypes | ActivitesTypes[]>,
  user: IUtilisateur | null | undefined
) => {
  if (
    permissionCheck(user?.permissionId, ['entreprise']) &&
    user?.entreprises?.length
  ) {
    const entreprisesIds = user.entreprises.map(e => e.id)

    q.where(b => {
      b.whereExists(
        TitresActivites.query()
          .alias('titresActivitesTitulaires')
          .joinRelated('titre.titulaires')
          .whereRaw('?? = ??', [
            'titresActivitesTitulaires.typeId',
            'activitesTypes.id'
          ])
          .whereIn('titre:titulaires.id', entreprisesIds)
      )
      b.orWhereExists(
        TitresActivites.query()
          .alias('titresActivitesAmodiataires')
          .joinRelated('titre.amodiataires')
          .whereRaw('?? = ??', [
            'titresActivitesAmodiataires.typeId',
            'activitesTypes.id'
          ])
          .whereIn('titre:amodiataires.id', entreprisesIds)
      )
    })
  } else if (permissionCheck(user?.permissionId, ['defaut'])) {
    q.where(false)
  }
}

export const demarchesCreationQuery = (
  q: QueryBuilder<DemarchesTypes, DemarchesTypes | DemarchesTypes[]>,
  user: IUtilisateur | null | undefined,
  { titreId, titreIdAlias }: { titreId?: string; titreIdAlias?: string }
) => {
  let demarchesCreation = raw('false')
  if (permissionCheck(user?.permissionId, ['super'])) {
    demarchesCreation = raw('true')
  } else if (
    permissionCheck(user?.permissionId, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length &&
    (titreId || titreIdAlias)
  ) {
    const titresModificationQuery =
      titresDemarchesAdministrationsModificationQuery(
        user.administrations,
        'demarchesTypes'
      )
    if (titreId) {
      titresModificationQuery.where('titresModification.id', titreId)
    } else {
      titresModificationQuery.whereRaw('?? = ??', [
        'titresModification.id',
        titreIdAlias
      ])
    }

    demarchesCreation = titresModificationQuery
  }

  q.select(demarchesCreation.as('demarchesCreation'))
}

const demarchesTypesQueryModify = (
  q: QueryBuilder<DemarchesTypes, DemarchesTypes | DemarchesTypes[]>,
  user: IUtilisateur | null | undefined,
  { titreId, titreIdAlias }: { titreId?: string; titreIdAlias?: string } = {}
) => {
  q.select('demarchesTypes.*')

  // propriété 'demarchesCreation' selon le profil de l'utilisateur
  demarchesCreationQuery(q, user, { titreId, titreIdAlias })
}

const permissionsQueryModify = (
  q: QueryBuilder<Permissions, Permissions | Permissions[]>,
  user: IUtilisateur | null | undefined
) => {
  // le super peut voir toutes les permissions sans restriction
  if (permissionCheck(user?.permissionId, ['super'])) {
    return q
  }

  // on retourne les permissions à partir de l'ordre suivant (éditeur)
  if (permissionCheck(user?.permissionId, ['admin'])) {
    return q.where('ordre', '>=', user!.permission.ordre + 1)
  }

  // un utilisateur ni super ni admin nepeut voir aucune permission
  return q.where(false)
}

export {
  activitesTypesQueryModify,
  demarchesTypesQueryModify,
  domainesQueryModify,
  administrationsEtapesTypesPropsQuery,
  entreprisesEtapesTypesPropsQuery,
  etapesTypesQueryModify,
  permissionsQueryModify,
  titresCreationQuery
}
