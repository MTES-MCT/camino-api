import { ITitresDemarches } from '../../types'
import { transaction, Transaction } from 'objection'
import TitresDemarches from '../models/titres-demarches'
import options from './_options'

const titresDemarchesGet = async (
  {
    demarchesIds,
    titresIds
  }: { demarchesIds?: string[] | null; titresIds?: string[] | null } = {},
  { graph = options.demarches.graph } = {}
) => {
  const q = TitresDemarches.query()
    .skipUndefined()
    .withGraphFetched(graph)
    .orderBy('ordre')

  if (demarchesIds) {
    q.whereIn('titresDemarches.typeId', demarchesIds)
  }

  if (titresIds) {
    q.whereIn('titresDemarches.titreId', titresIds)
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

const titreDemarcheCreate = async (titreDemarche: ITitresDemarches) =>
  TitresDemarches.query()
    .insertAndFetch(titreDemarche)
    .withGraphFetched(options.demarches.graph)

const titreDemarcheDelete = async (id: string, trx: Transaction) =>
  TitresDemarches.query(trx)
    .deleteById(id)
    .withGraphFetched(options.demarches.graph)
    .returning('*')

const titreDemarcheUpdate = async (
  id: string,
  props: Partial<ITitresDemarches>
) =>
  TitresDemarches.query()
    .withGraphFetched(options.demarches.graph)
    .patchAndFetchById(id, props)

const titreDemarcheUpsert = async (
  titreDemarche: ITitresDemarches,
  trx: Transaction
) =>
  TitresDemarches.query(trx)
    .upsertGraph(titreDemarche, options.demarches.update)
    .withGraphFetched(options.demarches.graph)
    .returning('*')

const titreDemarchesIdsUpdate = async (
  titresDemarchesIdsOld: string[],
  titresDemarchesNew: ITitresDemarches[]
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
