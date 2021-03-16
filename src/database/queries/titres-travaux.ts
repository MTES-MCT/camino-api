import { ITitreTravaux, IFields } from '../../types'
import { Transaction } from 'objection'

import TitresTravaux from '../models/titres-travaux'
import options from './_options'
import { fieldsFormat } from './graph/fields-format'
import graphBuild from './graph/build'
import { fieldsTitreAdd } from './graph/fields-add'
import { titresTravauxQueryModify } from './permissions/titres-travaux'
import { userGet } from './utilisateurs'

const titresTravauxGet = async (
  {
    titresTravauxIds
  }: {
    titresTravauxIds?: string[] | null
  } = {},
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = await userGet(userId)

  const graph = fields
    ? graphBuild(fieldsTitreAdd(fields), 'travaux', fieldsFormat)
    : options.titresTravaux.graph

  const q = TitresTravaux.query().withGraphFetched(graph)

  titresTravauxQueryModify(q, fields, user)

  if (titresTravauxIds) {
    q.whereIn('titresTravaux.id', titresTravauxIds)
  }

  return q
}

const titreTravauxGet = async (
  titreTravauxId: string,
  { fields }: { fields?: IFields },
  userId?: string
) => {
  const user = await userGet(userId)

  const graph = fields
    ? graphBuild(fieldsTitreAdd(fields), 'travaux', fieldsFormat)
    : options.titresTravaux.graph

  const q = TitresTravaux.query()
    .findById(titreTravauxId)
    .withGraphFetched(graph)

  titresTravauxQueryModify(q, fields, user)

  return q
}

const titreTravauxCreate = async (
  titreTravaux: ITitreTravaux,
  { fields }: { fields?: IFields }
) => {
  const graph = fields
    ? graphBuild(fieldsTitreAdd(fields), 'travaux', fieldsFormat)
    : options.titresTravaux.graph

  return TitresTravaux.query()
    .insertAndFetch(titreTravaux)
    .withGraphFetched(graph)
}

const titreTravauxUpdate = async (
  id: string,
  props: Partial<ITitreTravaux>,
  { fields }: { fields?: IFields }
) => {
  const graph = fields
    ? graphBuild(fieldsTitreAdd(fields), 'travaux', fieldsFormat)
    : options.titresTravaux.graph

  return TitresTravaux.query()
    .patchAndFetchById(id, props)
    .withGraphFetched(graph)
}

const titreTravauxDelete = async (id: string, trx?: Transaction) =>
  TitresTravaux.query(trx)
    .deleteById(id)
    .withGraphFetched(options.titresTravaux.graph)
    .returning('*')

export {
  titreTravauxGet,
  titresTravauxGet,
  titreTravauxCreate,
  titreTravauxUpdate,
  titreTravauxDelete
}
