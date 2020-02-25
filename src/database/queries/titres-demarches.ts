import { ITitreDemarche, ITitreEtape } from '../../types'
import { transaction, Transaction } from 'objection'
import TitresDemarches from '../models/titres-demarches'
import options from './_options'

const titresDemarchesGet = async (
  {
    pages,
    page,
    typeIds,
    statutIds,
    titreDomaineIds,
    titreTypeIds,
    titreStatutIds,
    etapesInclues,
    etapesExclues
  }: {
    pages?: number | null
    page?: number | null
    typeIds?: string[] | null
    statutIds?: string[] | null
    titreDomaineIds?: string[] | null
    titreTypeIds?: string[] | null
    titreStatutIds?: string[] | null
    etapesInclues?: Partial<ITitreEtape>[] | null
    etapesExclues?: Partial<ITitreEtape>[] | null
  } = {},
  { graph = options.demarches.graph } = {}
) => {
  const q = TitresDemarches.query()
    .skipUndefined()
    .withGraphFetched(graph)
    .orderBy('ordre')

  if (pages) {
    q.limit(pages)
  }

  if (page) {
    q.offset(page)
  }

  if (typeIds) {
    q.whereIn('titresDemarches.typeId', typeIds)
  }

  if (statutIds) {
    q.whereIn('titresDemarches.statutId', statutIds)
  }

  if (titreDomaineIds) {
    q.joinRelated('titre').whereIn('titre.domaineId', titreDomaineIds)
  }

  if (titreTypeIds) {
    q.joinRelated('titre.type').whereIn('titre:type.typeId', titreTypeIds)
  }

  if (titreStatutIds) {
    q.joinRelated('titre').whereIn('titre.statutId', titreStatutIds)
  }

  if (etapesInclues?.length || etapesExclues?.length) {
    q
      .joinRelated('etapes')
      .groupBy('titresDemarches.id')

    if (etapesInclues?.length) {
      const raw = etapesInclues
        .map(({ statutId }) => {
          const statutCond = statutId ? 'and etapes.statut_id = ?' : ''

          return `count(*) filter (where etapes.type_id = ? ${statutCond}) > 0`
        })
        .join(') and (')

      q.havingRaw(
        `(${raw})`,
        etapesInclues.flatMap(({ typeId, statutId }) => {
          const values = [typeId]

          if (statutId) {
            values.push(statutId)
          }

          return values
        })
      )
    }

    if (etapesExclues?.length) {
      const raw = etapesExclues
        .map(({ statutId }) => {
          const statutCond = statutId ? 'and etapes.statut_id = ?' : ''

          return `count(*) filter (where etapes.type_id = ? ${statutCond}) = 0`
        })

      q
        .havingRaw(
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
  titreDemarcheGet,
  titreDemarcheCreate,
  titreDemarcheUpdate,
  titreDemarcheUpsert,
  titreDemarcheDelete,
  titreDemarchesIdsUpdate
}
