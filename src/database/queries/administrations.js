import Administrations from '../models/administrations'
import options from './_options'

const administrationsGet = async () => Administrations.query()

const administrationUpdate = async administration =>
  Administrations.query().upsertGraph(
    administration,
    options.administrations.update
  )

export { administrationsGet, administrationUpdate }
