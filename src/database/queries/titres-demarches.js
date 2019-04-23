import { transaction } from 'objection'

import TitresDemarches from '../models/titres-demarches'
import { titreGet } from './titres'
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

  if (!titreDemarche) return titreDemarche

  const titre = await titreGet(titreDemarche.titreId)

  return titreDemarcheFormat(titreDemarche, titre.typeId)
}

const titreDemarcheDelete = async (id, trx) =>
  TitresDemarches.query(trx)
    .deleteById(id)
    .eager(options.demarches.eager)
    .returning('*')

const titreDemarcheUpsert = async (demarche, trx) =>
  TitresDemarches.query(trx)
    .upsertGraph(demarche, options.demarches.update)
    .eager(options.demarches.eager)

const titreDemarcheStatutIdUpdate = async ({ id, statutId }) =>
  TitresDemarches.query()
    .skipUndefined()
    .findById(id)
    .patch({ statutId })

const titreDemarcheOrdreUpdate = async ({ id, ordre }) =>
  TitresDemarches.query()
    .skipUndefined()
    .findById(id)
    .patch({ ordre })

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
  titreDemarcheUpsert,
  titreDemarcheDelete,
  titreDemarcheStatutIdUpdate,
  titreDemarcheOrdreUpdate,
  titreDemarchesIdsUpdate
}
