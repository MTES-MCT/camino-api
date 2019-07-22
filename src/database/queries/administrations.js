import Administrations from '../models/administrations'
import options from './_options'

const administrationsGet = async () =>
  Administrations.query().eager(options.administrations.eager)

const administrationsUpsert = async administrations =>
  Administrations.query().upsertGraph(
    administrations,
    options.administrations.update
  )

export { administrationsGet, administrationsUpsert }
