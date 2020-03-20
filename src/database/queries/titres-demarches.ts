import knex from '../index'

import {
  ITitreDemarche,
  ITitreEtapeFiltre,
  ITitreDemarcheColonneInput,
  IColonne,
  IFields,
  Index
} from '../../types'
import { transaction, Transaction, QueryBuilder } from 'objection'
import TitresDemarches from '../models/titres-demarches'
import options from './_options'
import graphFormat from './graph/format'
import graphBuild from './graph/build'
import { fieldTitreAdd } from './graph/fields-add'

const titreDemarchePermissionQueryBuild = (
  q: QueryBuilder<TitresDemarches, TitresDemarches | TitresDemarches[]>,
  userId = ''
) => {
  if (userId === 'super') {
    return q
  }

  q.select('titresDemarches.*')

  if (userId) {
    // isSuper
    q.leftJoin('utilisateurs AS us', b => {
      b.on('us.permissionId', '=', knex.raw('?', 'super'))
      b.on('us.id', '=', knex.raw('?', userId))
    })
    q.select('us.id as isSuper')
    q.groupBy('isSuper')

    // titulaires et amodiataires
    q.leftJoinRelated(
      'titre.[titulaires.utilisateurs, amodiataires.utilisateurs]'
    )

    // isAdmin
    q.leftJoin('utilisateurs AS ua', b => {
      b.onIn('ua.permissionId', ['admin', 'editeur', 'lecteur'])
      b.on('ua.id', '=', knex.raw('?', userId))
    })
    q.select('ua.id as isAdmin')
    q.groupBy('isAdmin')
  }

  q.leftJoinRelated(
    'titre.[type.autorisationsTitresStatuts, domaine.autorisation]'
  )

  q.andWhere(b => {
    if (userId) {
      b.orWhereNotNull('us.id')
      b.orWhereNotNull('ua.id')

      b.orWhereRaw('?? = ?', [
        'titre:titulaires:utilisateurs.id',
        userId
      ]).orWhereRaw('?? = ?', ['titre:amodiataires:utilisateurs.id', userId])
    }

    b.whereRaw('?? = ?', ['titre:domaine:autorisation.publicLecture', true])
      .whereRaw('?? = ??', [
        'titre:type:autorisationsTitresStatuts.titreStatutId',
        'titre.statutId'
      ])
      .whereRaw('?? = ?', [
        'titre:type:autorisationsTitresStatuts.publicLecture',
        true
      ])
  })

  return q
}

const titresDemarchesQueryBuild = (
  {
    typesIds,
    statutsIds,
    titresDomainesIds,
    titresTypesIds,
    titresStatutsIds,
    etapesInclues,
    etapesExclues
  }: {
    typesIds?: string[] | null
    statutsIds?: string[] | null
    titresDomainesIds?: string[] | null
    titresTypesIds?: string[] | null
    titresStatutsIds?: string[] | null
    etapesInclues?: ITitreEtapeFiltre[] | null
    etapesExclues?: ITitreEtapeFiltre[] | null
  } = {},
  fields: IFields,
  userId?: string
) => {
  fields = fieldTitreAdd(fields)
  const graph = graphBuild(fields, 'titre', graphFormat)

  const q = TitresDemarches.query()
    .skipUndefined()
    .withGraphFetched(graph)
    .groupBy('titresDemarches.id')

  titreDemarchePermissionQueryBuild(q, userId)

  if (typesIds) {
    q.whereIn('titresDemarches.typeId', typesIds)
  }

  if (statutsIds) {
    q.whereIn('titresDemarches.statutId', statutsIds)
  }

  if (titresDomainesIds) {
    q.joinRelated('titre').whereIn('titre.domaineId', titresDomainesIds)
  }

  if (titresTypesIds) {
    q.joinRelated('titre.type').whereIn('titre:type.typeId', titresTypesIds)
  }

  if (titresStatutsIds) {
    q.joinRelated('titre').whereIn('titre.statutId', titresStatutsIds)
  }

  if (etapesInclues?.length || etapesExclues?.length) {
    q.joinRelated('etapes').groupBy('titresDemarches.id')

    if (etapesInclues?.length) {
      const raw = etapesInclues
        .map(({ statutId, dateDebut, dateFin }) => {
          const statutCond = statutId ? 'and etapes.statut_id = ?' : ''
          const dateDebutCond = dateDebut ? 'and etapes.date >= ?' : ''
          const dateFinCond = dateFin ? 'and etapes.date <= ?' : ''

          return `count(*) filter (where etapes.type_id = ? ${statutCond} ${dateDebutCond} ${dateFinCond}) > 0`
        })
        .join(') and (')

      q.havingRaw(
        `(${raw})`,
        etapesInclues.flatMap(({ typeId, statutId, dateDebut, dateFin }) => {
          const values = [typeId]

          if (statutId) {
            values.push(statutId)
          }
          if (dateDebut) {
            values.push(dateDebut)
          }
          if (dateFin) {
            values.push(dateFin)
          }

          return values
        })
      )
    }

    if (etapesExclues?.length) {
      const raw = etapesExclues.map(({ statutId }) => {
        const statutCond = statutId ? 'and etapes.statut_id = ?' : ''

        return `count(*) filter (where etapes.type_id = ? ${statutCond}) = 0`
      })

      q.havingRaw(
        `(${raw})`,
        etapesExclues.flatMap(({ typeId, statutId }) => {
          const values = [typeId]

          if (statutId) {
            values.push(statutId)
          }

          return values
        })
      )
    }
  }

  return q
}

const titresDemarchesCount = async (
  {
    typesIds,
    statutsIds,
    titresDomainesIds,
    titresTypesIds,
    titresStatutsIds,
    etapesInclues,
    etapesExclues
  }: {
    typesIds?: string[] | null
    statutsIds?: string[] | null
    titresDomainesIds?: string[] | null
    titresTypesIds?: string[] | null
    titresStatutsIds?: string[] | null
    etapesInclues?: ITitreEtapeFiltre[] | null
    etapesExclues?: ITitreEtapeFiltre[] | null
  } = {},
  { fields }: { fields: IFields },
  userId?: string
) => {
  const q = titresDemarchesQueryBuild(
    {
      typesIds,
      statutsIds,
      titresDomainesIds,
      titresTypesIds,
      titresStatutsIds,
      etapesInclues,
      etapesExclues
    },
    fields,
    userId
  )

  const titresDemarches = ((await q) as unknown) as { total: number }[]

  return titresDemarches.length
}

const titresDemarchesColonnes = {
  titreNom: { id: 'titre.nom', relation: 'titre' },
  titreDomaine: { id: 'titre.domaineId', relation: 'titre' },
  titreType: { id: 'titre:type:type.nom', relation: 'titre.type.type' },
  titreStatut: { id: 'titre.statutId', relation: 'titre' },
  type: { id: 'typeId' },
  statut: { id: 'statutId' }
} as Index<IColonne>

const titresDemarchesGet = async (
  {
    intervalle,
    page,
    colonne,
    ordre,
    typesIds,
    statutsIds,
    titresDomainesIds,
    titresTypesIds,
    titresStatutsIds,
    etapesInclues,
    etapesExclues
  }: {
    intervalle?: number | null
    page?: number | null
    colonne?: ITitreDemarcheColonneInput | null
    ordre?: 'asc' | 'desc' | null
    typesIds?: string[] | null
    statutsIds?: string[] | null
    titresDomainesIds?: string[] | null
    titresTypesIds?: string[] | null
    titresStatutsIds?: string[] | null
    etapesInclues?: ITitreEtapeFiltre[] | null
    etapesExclues?: ITitreEtapeFiltre[] | null
  } = {},
  { fields }: { fields: IFields },
  userId?: string
) => {
  const q = titresDemarchesQueryBuild(
    {
      typesIds,
      statutsIds,
      titresDomainesIds,
      titresTypesIds,
      titresStatutsIds,
      etapesInclues,
      etapesExclues
    },
    fields,
    userId
  )

  if (colonne) {
    if (titresDemarchesColonnes[colonne].relation) {
      q.leftJoinRelated(titresDemarchesColonnes[colonne].relation!).groupBy(
        titresDemarchesColonnes[colonne].id!
      )
    }
    q.orderBy(titresDemarchesColonnes[colonne].id, ordre || undefined)
  } else {
    q.orderBy('titresDemarches.ordre')
  }

  if (page && intervalle) {
    q.offset((page - 1) * intervalle)
  }

  if (intervalle) {
    q.limit(intervalle)
  }

  return q
}

const titreDemarcheGet = async (
  titreDemarcheId: string,
  { fields }: { fields?: IFields } = {},
  userId?: string
) => {
  const graph = fields
    ? graphBuild(fieldTitreAdd(fields), 'titre', graphFormat)
    : options.demarches.graph

  const q = TitresDemarches.query()
    .withGraphFetched(graph)
    .findById(titreDemarcheId)

  titreDemarchePermissionQueryBuild(q, userId)

  return q
}

const titreDemarcheCreate = async (titreDemarche: ITitreDemarche) =>
  TitresDemarches.query()
    .insertAndFetch(titreDemarche)
    .withGraphFetched(options.demarches.graph)

const titreDemarcheDelete = async (id: string, trx?: Transaction) =>
  TitresDemarches.query(trx)
    .deleteById(id)
    .withGraphFetched(options.demarches.graph)
    .returning('*')

const titreDemarcheUpdate = async (
  id: string,
  props: Partial<ITitreDemarche>
) =>
  TitresDemarches.query()
    .withGraphFetched(options.demarches.graph)
    .patchAndFetchById(id, props)

const titreDemarcheUpsert = async (
  titreDemarche: ITitreDemarche,
  trx: Transaction
) =>
  TitresDemarches.query(trx)
    .upsertGraph(titreDemarche, options.demarches.update)
    .withGraphFetched(options.demarches.graph)
    .returning('*')

const titreDemarchesIdsUpdate = async (
  titresDemarchesIdsOld: string[],
  titresDemarchesNew: ITitreDemarche[]
) => {
  const knex = TitresDemarches.knex()

  return transaction(knex, async tr => {
    await Promise.all(
      titresDemarchesIdsOld.map(titreDemarcheId =>
        titreDemarcheDelete(titreDemarcheId, tr)
      )
    )
    await Promise.all(
      titresDemarchesNew.map(titreDemarche =>
        titreDemarcheUpsert(titreDemarche, tr)
      )
    )
  })
}

export {
  titresDemarchesGet,
  titresDemarchesCount,
  titreDemarcheGet,
  titreDemarcheCreate,
  titreDemarcheUpdate,
  titreDemarcheUpsert,
  titreDemarcheDelete,
  titreDemarchesIdsUpdate
}
