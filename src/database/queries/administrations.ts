import { IAdministration, IFields } from '../../types'
import Administrations from '../models/administrations'
import options from './_options'

// import { userGet } from './utilisateurs'

import graphBuild from './graph/build'
import graphFormat from './graph/format'

const administrationGet = async (
  id: string,
  { fields }: { fields?: IFields },
  userId?: string
) => {
  // const user = userId && (await userGet(userId))

  const graph = fields
    ? graphBuild(fields, 'administration', graphFormat)
    : options.administrations.graph

  return Administrations.query()
    .findById(id)
    .withGraphFetched(graph)
}

const administrationsGet = async (
  _: any,
  { fields }: { fields?: IFields },
  userId?: string
) => {
  // const user = userId && (await userGet(userId))

  const graph = fields
    ? graphBuild(fields, 'administration', graphFormat)
    : options.administrations.graph

  return Administrations.query()
    .skipUndefined()
    .withGraphFetched(graph)
}

const administrationsUpsert = async (administrations: IAdministration[]) =>
  Administrations.query()
    .withGraphFetched(options.administrations.graph)
    .upsertGraph(administrations, options.administrations.update)

export { administrationGet, administrationsGet, administrationsUpsert }
