import { transaction } from 'objection'
import TitresDemarches from '../models/titres-demarches'
import options from './_options'

const titresDemarchesGet = async (
  { demarchesIds, titresIds } = {},
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
  titreDemarcheId,
  { graph = options.demarches.graph } = {}
) =>
  TitresDemarches.query()
    .withGraphFetched(graph)
    .findById(titreDemarcheId)

const titreDemarcheCreate = async demarche =>
  TitresDemarches.query()
    .insertAndFetch(demarche)
    .withGraphFetched(options.demarches.graph)

const titreDemarcheDelete = async (id, trx) =>
  TitresDemarches.query(trx)
    .deleteById(id)
    .withGraphFetched(options.demarches.graph)
    .returning('*')

const titreDemarcheUpdate = async (id, props) =>
  TitresDemarches.query()
    .withGraphFetched(options.demarches.graph)
    .patchAndFetchById(id, props)

const titreDemarcheUpsert = async (demarche, trx) =>
  TitresDemarches.query(trx)
    .upsertGraph(demarche, options.demarches.update)
    .withGraphFetched(options.demarches.graph)
    .returning('*')

const titreDemarchesIdsUpdate = async (
  titresDemarchesIdsOld,
  titresDemarchesNew
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
