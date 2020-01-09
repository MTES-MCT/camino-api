import Communes from '../models/communes'
import Departements from '../models/departements'
import Pays from '../models/pays'
import _options from './_options'

const paysGet = async () => Pays.query().withGraphFetched(_options.pays.graph)
const departementsGet = async () => Departements.query()

const communesGet = async () =>
  Communes.query().withGraphFetched(_options.communes.graph)

const communesUpsert = async (communes: Communes) =>
  Communes.query().upsertGraph(communes, { insertMissing: true })

export { departementsGet, communesUpsert, communesGet, paysGet }
