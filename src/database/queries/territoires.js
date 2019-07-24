import Departements from '../models/departements'
import Communes from '../models/communes'
import _options from './_options'

const departementsGet = async () => Departements.query()

const communesGet = async () => Communes.query().eager(_options.communes.eager)

const communesUpsert = async communes =>
  Communes.query().upsertGraph(communes, { insertMissing: true })

export { departementsGet, communesUpsert, communesGet }
