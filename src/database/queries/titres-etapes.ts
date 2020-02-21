import { transaction, Transaction } from 'objection'
import {
  ITitreEtape,
  ITitreCommune,
  ITitreAdministrationLocale
} from '../../types'

import TitresEtapes from '../models/titres-etapes'
import TitresCommunes from '../models/titres-communes'
import TitresAdministrationsLocales from '../models/titres-administrations-locales'
import options from './_options'

const titresEtapesGet = async (
  {
    etapesIds,
    etapesTypeIds,
    titresDemarchesIds
  }: {
    etapesIds?: string[] | null
    etapesTypeIds?: string[] | null
    titresDemarchesIds?: string[] | null
  } = {},
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
  titreEtapeId: string,
  { graph = options.etapes.graph } = {}
) =>
  TitresEtapes.query()
    .withGraphFetched(graph)
    .findById(titreEtapeId)

const titreEtapeCreate = async (titreEtape: ITitreEtape) =>
  TitresEtapes.query()
    .insertAndFetch(titreEtape)
    .withGraphFetched(options.etapes.graph)

const titreEtapeUpdate = async (id: string, props: Partial<ITitreEtape>) =>
  TitresEtapes.query()
    .withGraphFetched(options.etapes.graph)
    .patchAndFetchById(id, props)

const titreEtapeDelete = async (id: string, trx?: Transaction) =>
  TitresEtapes.query(trx)
    .deleteById(id)
    .withGraphFetched(options.etapes.graph)
    .returning('*')

const titreEtapeUpsert = async (titreEtape: ITitreEtape, trx?: Transaction) =>
  TitresEtapes.query(trx)
    .upsertGraph(titreEtape, options.etapes.update)
    .withGraphFetched(options.etapes.graph)
    .returning('*')

const titresEtapesCommunesGet = async () => TitresCommunes.query()

const titresEtapesCommunesUpdate = async (
  titresEtapesCommunes: ITitreCommune
) =>
  TitresCommunes.query().upsertGraph(titresEtapesCommunes, {
    insertMissing: true
  })

const titreEtapeCommuneDelete = async (
  titreEtapeId: string,
  communeId: string
) =>
  TitresCommunes.query()
    .delete()
    .where('titreEtapeId', titreEtapeId)
    .andWhere('communeId', communeId)

const titresEtapesAdministrationsCreate = async (
  titresEtapesAdministrations: ITitreAdministrationLocale[]
) => TitresAdministrationsLocales.query().insert(titresEtapesAdministrations)

const titreEtapeAdministrationDelete = async (
  titreEtapeId: string,
  administrationId: string
) =>
  TitresAdministrationsLocales.query()
    .delete()
    .where('titreEtapeId', titreEtapeId)
    .andWhere('administrationId', administrationId)

const titreEtapesIdsUpdate = async (
  titresEtapesIdsOld: string[],
  titresEtapesNew: ITitreEtape[]
) => {
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
