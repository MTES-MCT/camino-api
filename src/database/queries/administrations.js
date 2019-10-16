import Administrations from '../models/administrations'
import options from './_options'

const administrationGet = async (
  id,
  { eager = options.administrations.eager } = {}
) =>
  Administrations.query()
    .findById(id)
    .eager(eager)

const administrationsGet = async (
  args,
  { eager = options.administrations.eager } = {}
) =>
  Administrations.query()
    .skipUndefined()
    .eager(eager)

const administrationsUpsert = async administrations =>
  Administrations.query()
    .eager(options.administrations.eager)
    .upsertGraph(administrations, options.administrations.update)

export { administrationGet, administrationsGet, administrationsUpsert }
