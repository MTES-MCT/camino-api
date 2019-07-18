import { transaction } from 'objection'

import TitresEtapes from '../models/titres-etapes'
import TitresCommunes from '../models/titres-communes'
import TitresAdministrations from '../models/titres-administrations'
import options from './_options'
import { titreEtapeFormat } from './_format'

const titresEtapesGet = async ({
  etapesIds,
  etapesTypeIds,
  titresDemarchesIds
} = {}) =>
  TitresEtapes.query()
    .skipUndefined()
    .eager(options.etapes.eager)
    .orderBy('ordre')
    .whereIn('titresEtapes.id', etapesIds)
    .whereIn('titresEtapes.typeId', etapesTypeIds)
    .whereIn('titresEtapes.titreDemarcheId', titresDemarchesIds)

const titreEtapeGet = async titreEtapeId =>
  TitresEtapes.query()
    .eager(options.etapes.eager)
    .findById(titreEtapeId)

const titreEtapeCreate = async etape => {
  const titreEtape = await TitresEtapes.query()
    .insertAndFetch(etape)
    .eager(options.etapes.eager)

  return titreEtape && titreEtapeFormat(titreEtape)
}

const titreEtapeUpdate = async (id, props) =>
  TitresEtapes.query()
    .eager(options.etapes.eager)
    .patchAndFetchById(id, props)

const titreEtapeDelete = async (id, trx) =>
  TitresEtapes.query(trx)
    .deleteById(id)
    .eager(options.etapes.eager)
    .returning('*')

const titreEtapeUpsert = async (etape, trx) =>
  TitresEtapes.query(trx)
    .upsertGraph(etape, options.etapes.update)
    .eager(options.etapes.eager)
    .returning('*')

const titresEtapesCommunesGet = async () => TitresCommunes.query()

const titreEtapeCommuneInsert = async ({ titreEtapeId, communeId }) =>
  TitresCommunes.query().insert({ titreEtapeId, communeId })

const titreEtapeCommuneDelete = async ({ titreEtapeId, communeId }) =>
  TitresCommunes.query()
    .delete()
    .where('titreEtapeId', titreEtapeId)
    .andWhere('communeId', communeId)

const titreEtapeAdministrationInsert = async ({
  titreEtapeId,
  administrationId
}) => TitresAdministrations.query().insert({ titreEtapeId, administrationId })

const titreEtapeAdministrationDelete = async ({
  titreEtapeId,
  administrationId
}) =>
  TitresAdministrations.query()
    .delete()
    .where('titreEtapeId', titreEtapeId)
    .andWhere('administrationId', administrationId)

const titreEtapesIdsUpdate = async (titresEtapesIdsOld, titresEtapesNew) => {
  const knex = TitresEtapes.knex()

  return transaction(knex, async tr => {
    await Promise.all(
      titresEtapesIdsOld.map(titreEtapeId => titreEtapeDelete(titreEtapeId, tr))
    )
    await Promise.all(
      titresEtapesNew.map(titreEtape => titreEtapeUpsert(titreEtape, tr))
    )
  })
}

export {
  titresEtapesGet,
  titreEtapeGet,
  titreEtapeCreate,
  titreEtapeUpdate,
  titreEtapeUpsert,
  titreEtapeCommuneInsert,
  titreEtapeCommuneDelete,
  titresEtapesCommunesGet,
  titreEtapeAdministrationInsert,
  titreEtapeAdministrationDelete,
  titreEtapesIdsUpdate,
  titreEtapeDelete
}
