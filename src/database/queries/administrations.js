import Administrations from '../models/administrations'
import options from './_options'

const administrationsGet = async () =>
  Administrations.query().eager(options.administrations.eager)

const administrationUpdate = async administration =>
  Administrations.query().upsertGraph(
    administration,
    options.administrations.update
  )

export { administrationsGet, administrationUpdate }
