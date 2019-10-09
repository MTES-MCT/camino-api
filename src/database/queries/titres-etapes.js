import { transaction } from 'objection'

import TitresEtapes from '../models/titres-etapes'
import TitresCommunes from '../models/titres-communes'
import TitresAdministrations from '../models/titres-administrations'
import options from './_options'

const titresEtapesGet = async (
  { etapesIds, etapesTypeIds, titresDemarchesIds } = {},
  { eager = options.etapes.eager } = {}
) => {
  const q = TitresEtapes.query()
    .skipUndefined()
    .eager(eager)
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
  { eager = options.etapes.eager } = {}
) =>
  TitresEtapes.query()
    .eager(eager)
    .findById(titreEtapeId)

const titreEtapeCreate = async etape =>
  TitresEtapes.query()
    .insertAndFetch(etape)
    .eager(options.etapes.eager)

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

const titresEtapesCommunesCreate = async titresEtapesCommunes =>
  TitresCommunes.query().insert(titresEtapesCommunes)

const titreEtapeCommuneDelete = async (titreEtapeId, communeId) =>
  TitresCommunes.query()
    .delete()
    .where('titreEtapeId', titreEtapeId)
    .andWhere('communeId', communeId)

const titresEtapesAdministrationsCreate = async titresEtapesAdministrations =>
  TitresAdministrations.query().insert(titresEtapesAdministrations)

const titreEtapeAdministrationDelete = async (titreEtapeId, administrationId) =>
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
  titresEtapesCommunesCreate,
  titreEtapeCommuneDelete,
  titresEtapesCommunesGet,
  titresEtapesAdministrationsCreate,
  titreEtapeAdministrationDelete,
  titreEtapesIdsUpdate,
  titreEtapeDelete
}
