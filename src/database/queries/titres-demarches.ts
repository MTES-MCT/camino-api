import {
  ITitreDemarche,
  ITitreEtapeFiltre,
  ITitreDemarcheColonneInput,
  IColonnes
} from '../../types'
import { transaction, Transaction, QueryBuilder } from 'objection'
import TitresDemarches from '../models/titres-demarches'
import options from './_options'

const titresDemarchesColonnes = {
  titreNom: { id: 'titre.nom', relation: 'titre' },
  titreDomaine: { id: 'titre.domaineId', relation: 'titre' },
  titreType: { id: 'titre:type:type.nom', relation: 'titre.type.type' },
  titreStatut: { id: 'titre.statutId', relation: 'titre' },
  type: { id: 'typeId' },
  statut: { id: 'statutId' }
} as IColonnes

const titresDemarchesQueryBuild = (
  q: QueryBuilder<TitresDemarches, TitresDemarches[]>,
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
  } = {}
) => {
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
  { graph = options.demarches.graph } = {}
) => {
  const q = TitresDemarches.query()
    .skipUndefined()
    .withGraphFetched(graph)
    .count('titresDemarches.*', { as: 'total' })

  titresDemarchesQueryBuild(q, {
    typesIds,
    statutsIds,
    titresDomainesIds,
    titresTypesIds,
    titresStatutsIds,
    etapesInclues,
    etapesExclues
  })

  const titresDemarches = ((await q) as unknown) as { total: number }[]

  return titresDemarches[0].total
}

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
  { graph = options.demarches.graph } = {}
) => {
  const q = TitresDemarches.query()
    .skipUndefined()
    .withGraphFetched(graph)

  if (colonne) {
    if (titresDemarchesColonnes[colonne].relation) {
      q.joinRelated(titresDemarchesColonnes[colonne].relation!)
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

  titresDemarchesQueryBuild(q, {
    typesIds,
    statutsIds,
    titresDomainesIds,
    titresTypesIds,
    titresStatutsIds,
    etapesInclues,
    etapesExclues
  })

  return q
}

const titreDemarcheGet = async (
  titreDemarcheId: string,
  { graph = options.demarches.graph } = {}
) =>
  TitresDemarches.query()
    .withGraphFetched(graph)
    .findById(titreDemarcheId)

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
