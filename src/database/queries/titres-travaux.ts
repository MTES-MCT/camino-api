import { ITitreTravaux, IFields } from '../../types'
import { Transaction } from 'objection'

import TitresTravaux from '../models/titres-travaux'
import options from './_options'
import graphFormat from './graph/format'
import graphBuild from './graph/build'
import { fieldTitreAdd } from './graph/fields-add'

const titreTravauxGet = async (
  titreTravauxId: string,
  { fields }: { fields?: IFields }
) => {
  const graph = fields
    ? graphBuild(fieldTitreAdd(fields), 'travaux', graphFormat)
    : options.titresTravaux.graph

  const q = TitresTravaux.query()
    .findById(titreTravauxId)
    .withGraphFetched(graph)

  return q
}

const titreTravauxCreate = async (
  titreTravaux: ITitreTravaux,
  { fields }: { fields?: IFields }
) => {
  const graph = fields
    ? graphBuild(fieldTitreAdd(fields), 'travaux', graphFormat)
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
    ? graphBuild(fieldTitreAdd(fields), 'travaux', graphFormat)
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
  titreTravauxCreate,
  titreTravauxUpdate,
  titreTravauxDelete
}
