import Administrations from '../models/administrations'
import options from './_options'

const administrationsGet = async () => Administrations.query()

const administrationUpdate = async administration =>
  Administrations.query().upsertGraph(administration, { insertMissing: true })

export { administrationsGet, administrationUpdate }
