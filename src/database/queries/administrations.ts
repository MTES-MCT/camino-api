import { IAdministrations } from '../../types'
import Administrations from '../models/administrations'
import options from './_options'

const administrationGet = async (
  id: string,
  { graph = options.administrations.graph } = {}
) =>
  Administrations.query()
    .findById(id)
    .withGraphFetched(graph)

const administrationsGet = async (
  _?: any,
  { graph = options.administrations.graph } = {}
) =>
  Administrations.query()
    .skipUndefined()
    .withGraphFetched(graph)

const administrationsUpsert = async (administrations: IAdministrations) =>
  Administrations.query()
    .withGraphFetched(options.administrations.graph)
    .upsertGraph(administrations, options.administrations.update)

export { administrationGet, administrationsGet, administrationsUpsert }
