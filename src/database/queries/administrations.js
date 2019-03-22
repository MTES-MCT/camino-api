import Administrations from '../models/administrations'
import _options from './_options'

const administrationInsert = async administration =>
  Administrations.query().upsertGraph(administration, { insertMissing: true })

export { administrationInsert }
