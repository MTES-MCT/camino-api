import { transaction } from 'objection'
import TitresDemarches from '../models/titres-demarches'
import options from './_options'

const titresDemarchesGet = async (
  { demarchesIds, titresIds } = {},
  { eager = options.demarches.eager } = {}
) => {
  const q = TitresDemarches.query()
    .skipUndefined()
    .eager(eager)
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
  { eager = options.demarches.eager } = {}
) =>
  TitresDemarches.query()
    .eager(eager)
    .findById(titreDemarcheId)

const titreDemarcheCreate = async demarche =>
  TitresDemarches.query()
    .insertAndFetch(demarche)
    .eager(options.demarches.eager)

const titreDemarcheDelete = async (id, trx) =>
  TitresDemarches.query(trx)
    .deleteById(id)
    .eager(options.demarches.eager)
    .returning('*')

const titreDemarcheUpdate = async (id, props) =>
  TitresDemarches.query()
    .eager(options.demarches.eager)
    .patchAndFetchById(id, props)

const titreDemarcheUpsert = async (demarche, trx) =>
  TitresDemarches.query(trx)
    .upsertGraph(demarche, options.demarches.update)
    .eager(options.demarches.eager)
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
