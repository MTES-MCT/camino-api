import { Transaction } from 'objection'
import { IFields, IUtilisateur, ITitreTravauxEtape } from '../../types'

import options from './_options'
import graphBuild from './graph/build'
import { fieldsFormat } from './graph/fields-format'
import { userGet } from './utilisateurs'
import TitresTravauxEtapes from '../models/titres-travaux-etapes'
import { titreTravauxEtapeQueryModify } from './permissions/titres-travaux-etapes'

const titresTravauxEtapesQueryBuild = (
  {
    etapesIds,
    etapesTypesIds,
    titresTravauxIds
  }: {
    etapesIds?: string[] | null
    etapesTypesIds?: string[] | null
    titresTravauxIds?: string[] | null
  } = {},
  { fields }: { fields?: IFields },
  user?: IUtilisateur
) => {
  const graph = fields
    ? graphBuild(fields, 'etapes', fieldsFormat)
    : options.titresTravauxEtapes.graph

  const q = TitresTravauxEtapes.query().skipUndefined().withGraphFetched(graph)

  titreTravauxEtapeQueryModify(q, user)

  if (etapesIds) {
    q.whereIn('titresTravauxEtapes.id', etapesIds)
  }

  if (etapesTypesIds) {
    q.whereIn('titresTravauxEtapes.typeId', etapesTypesIds)
  }

  if (titresTravauxIds) {
    q.whereIn('titresTravauxEtapes.titreTravauxId', titresTravauxIds)
  }

  // console.info(q.toKnexQuery().toString())

  return q
}

const titreTravauxEtapeGet = async (
  etapeId: string,
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = userId ? await userGet(userId) : undefined

  const q = titresTravauxEtapesQueryBuild({}, { fields }, user)

  return (await q.findById(etapeId)) as ITitreTravauxEtape
}

const titresTravauxEtapesGet = async (
  {
    etapesIds,
    etapesTypesIds,
    titresTravauxIds
  }: {
    etapesIds?: string[] | null
    etapesTypesIds?: string[] | null
    titresTravauxIds?: string[] | null
  } = {},
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = userId ? await userGet(userId) : undefined

  const q = titresTravauxEtapesQueryBuild(
    { etapesIds, etapesTypesIds, titresTravauxIds },
    { fields },
    user
  )

  q.orderBy('ordre')

  return q
}

const titreTravauxEtapeCreate = async (titreTravauxEtape: ITitreTravauxEtape) =>
  TitresTravauxEtapes.query()
    .insertAndFetch(titreTravauxEtape)
    .withGraphFetched(options.titresTravauxEtapes.graph)

const titreTravauxEtapeUpdate = async (
  id: string,
  props: Partial<ITitreTravauxEtape>
) =>
  TitresTravauxEtapes.query()
    .withGraphFetched(options.titresTravauxEtapes.graph)
    .patchAndFetchById(id, props)

const titreTravauxEtapeDelete = async (id: string, trx?: Transaction) =>
  TitresTravauxEtapes.query(trx)
    .deleteById(id)
    .withGraphFetched(options.titresTravauxEtapes.graph)
    .returning('*')

const titreTravauxEtapeUpsert = async (
  titreTravauxEtape: ITitreTravauxEtape,
  trx?: Transaction
) =>
  TitresTravauxEtapes.query(trx)
    .upsertGraph(titreTravauxEtape, options.titresTravauxEtapes.update)
    .withGraphFetched(options.titresTravauxEtapes.graph)
    .returning('*')

export {
  titresTravauxEtapesGet,
  titreTravauxEtapeGet,
  titreTravauxEtapeCreate,
  titreTravauxEtapeUpdate,
  titreTravauxEtapeUpsert,
  titreTravauxEtapeDelete
}
