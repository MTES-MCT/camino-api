import Administrations from '../models/administrations'
import options from './_options'

const administrationGet = async (
  id,
  { graph = options.administrations.graph } = {}
) =>
  Administrations.query()
    .findById(id)
    .withGraphFetched(graph)

const administrationsGet = async (
  args,
  { graph = options.administrations.graph } = {}
) =>
  Administrations.query()
    .skipUndefined()
    .withGraphFetched(graph)

const administrationsUpsert = async administrations =>
  Administrations.query()
    .withGraphFetched(options.administrations.graph)
    .upsertGraph(administrations, options.administrations.update)

export { administrationGet, administrationsGet, administrationsUpsert }
