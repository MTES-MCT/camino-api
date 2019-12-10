import { transaction } from 'objection'

import TitresEtapes from '../models/titres-etapes'
import TitresCommunes from '../models/titres-communes'
import TitresAdministrationsLocales from '../models/titres-administrations-locales'
import options from './_options'

const titresEtapesGet = async (
  { etapesIds, etapesTypeIds, titresDemarchesIds } = {},
  { graph = options.etapes.graph } = {}
) => {
  const q = TitresEtapes.query()
    .skipUndefined()
    .withGraphFetched(graph)
    .orderBy('ordre')

  if (etapesIds) {
    q.whereIn('titresEtapes.id', etapesIds)
  }

  if (etapesTypeIds) {
    q.whereIn('titresEtapes.typeId', etapesTypeIds)
  }

  if (titresDemarchesIds) {
    q.whereIn('titresEtapes.titreDemarcheId', titresDemarchesIds)
  }

  return q
}

const titreEtapeGet = async (
  titreEtapeId,
  { graph = options.etapes.graph } = {}
) =>
  TitresEtapes.query()
    .withGraphFetched(graph)
    .findById(titreEtapeId)

const titreEtapeCreate = async etape =>
  TitresEtapes.query()
    .insertAndFetch(etape)
    .withGraphFetched(options.etapes.graph)

const titreEtapeUpdate = async (id, props) =>
  TitresEtapes.query()
    .withGraphFetched(options.etapes.graph)
    .patchAndFetchById(id, props)

const titreEtapeDelete = async (id, trx) =>
  TitresEtapes.query(trx)
    .deleteById(id)
    .withGraphFetched(options.etapes.graph)
    .returning('*')

const titreEtapeUpsert = async (etape, trx) =>
  TitresEtapes.query(trx)
    .upsertGraph(etape, options.etapes.update)
    .withGraphFetched(options.etapes.graph)
    .returning('*')

const titresEtapesCommunesGet = async () => TitresCommunes.query()

const titresEtapesCommunesUpdate = async titresEtapesCommunes =>
  TitresCommunes.query().upsertGraph(titresEtapesCommunes)

const titreEtapeCommuneDelete = async (titreEtapeId, communeId) =>
  TitresCommunes.query()
    .delete()
    .where('titreEtapeId', titreEtapeId)
    .andWhere('communeId', communeId)

const titresEtapesAdministrationsCreate = async titresEtapesAdministrations =>
  TitresAdministrationsLocales.query().insert(titresEtapesAdministrations)

const titreEtapeAdministrationDelete = async (titreEtapeId, administrationId) =>
  TitresAdministrationsLocales.query()
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
  titresEtapesCommunesUpdate,
  titreEtapeCommuneDelete,
  titresEtapesCommunesGet,
  titresEtapesAdministrationsCreate,
  titreEtapeAdministrationDelete,
  titreEtapesIdsUpdate,
  titreEtapeDelete
}
