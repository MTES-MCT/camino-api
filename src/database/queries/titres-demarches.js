import { transaction } from 'objection'
import TitresDemarches from '../models/titres-demarches'
import options from './_options'
import { titreDemarcheFormat } from './_format'

const titresDemarchesGet = async ({ demarchesIds, titresIds } = {}) =>
  TitresDemarches.query()
    .skipUndefined()
    .eager(options.demarches.eager)
    .orderBy('ordre')
    .whereIn('titresDemarches.typeId', demarchesIds)
    .whereIn('titresDemarches.titreId', titresIds)

const titreDemarcheGet = async demarcheId => {
  const q = TitresDemarches.query()
    .eager(options.demarches.eager)
    .findById(demarcheId)

  const titreDemarche = await q

  return titreDemarche && titreDemarcheFormat(titreDemarche)
}

const titreDemarcheCreate = async demarche => {
  const titreDemarche = await TitresDemarches.query()
    .insertAndFetch(demarche)
    .eager(options.demarches.eager)

  return titreDemarche && titreDemarcheFormat(titreDemarche)
}

const titreDemarcheDelete = async (id, trx) =>
  TitresDemarches.query(trx)
    .deleteById(id)
    .eager(options.demarches.eager)
    .returning('*')

const titreDemarcheUpdate = async (id, props) => {
  const titreDemarche = await TitresDemarches.query()
    .eager(options.demarches.eager)
    .patchAndFetchById(id, props)

  return titreDemarche && titreDemarcheFormat(titreDemarche)
}

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
