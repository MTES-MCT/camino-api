import { transaction, Transaction } from 'objection'
import {
  ITitreEtape,
  ITitreCommune,
  ITitreAdministrationLocale,
  IFields,
  IUtilisateur
} from '../../types'

import TitresEtapes from '../models/titres-etapes'
import TitresCommunes from '../models/titres-communes'
import TitresAdministrationsLocales from '../models/titres-administrations-locales'
import options from './_options'
import { titreEtapesPermissionQueryBuild } from './_permissions'
import graphBuild from './graph/build'
import graphFormat from './graph/format'
import { userGet } from './utilisateurs'

const titresEtapesQueryBuild = (
  {
    etapesIds,
    etapesTypesIds,
    titresDemarchesIds
  }: {
    etapesIds?: string[] | null
    etapesTypesIds?: string[] | null
    titresDemarchesIds?: string[] | null
  } = {},
  { fields }: { fields?: IFields },
  user?: IUtilisateur
) => {
  const graph = fields
    ? graphBuild(fields, 'etapes', graphFormat)
    : options.etapes.graph

  const q = TitresEtapes.query()
    .skipUndefined()
    .withGraphFetched(graph)

  titreEtapesPermissionQueryBuild(q, user)

  if (etapesIds) {
    q.whereIn('titresEtapes.id', etapesIds)
  }

  if (etapesTypesIds) {
    q.whereIn('titresEtapes.typeId', etapesTypesIds)
  }

  if (titresDemarchesIds) {
    q.whereIn('titresEtapes.titreDemarcheId', titresDemarchesIds)
  }

  // console.log(q.toKnexQuery().toString())

  return q
}

// utilisé dans le daily et le résolver des documents uniquement
const titreEtapeGet = async (
  titreEtapeId: string,
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = userId ? await userGet(userId) : undefined

  const q = titresEtapesQueryBuild({}, { fields }, user)

  return (await q.findById(titreEtapeId)) as ITitreEtape
}

// utilisé dans le daily uniquement
const titresEtapesGet = async (
  {
    etapesIds,
    etapesTypesIds,
    titresDemarchesIds
  }: {
    etapesIds?: string[] | null
    etapesTypesIds?: string[] | null
    titresDemarchesIds?: string[] | null
  } = {},
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = userId ? await userGet(userId) : undefined

  const q = titresEtapesQueryBuild(
    { etapesIds, etapesTypesIds, titresDemarchesIds },
    { fields },
    user
  )

  q.orderBy('ordre')

  return q
}

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
