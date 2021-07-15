import { ICommune, IForet } from '../../types'

import options from './_options'

import Communes from '../models/communes'
import Departements from '../models/departements'
import Pays from '../models/pays'
import Forets from '../models/forets'
import Regions from '../models/regions'

const paysGet = async () => Pays.query().withGraphFetched(options.pays.graph)

const departementsGet = async () => Departements.query()

const regionsGet = async () => Regions.query()

const communesGet = async (): Promise<ICommune[]> =>
  Communes.query().withGraphFetched(options.communes.graph)

const communesUpsert = async (communes: ICommune[]) =>
  Communes.query().upsertGraph(communes, { insertMissing: true })

const foretsGet = async () => Forets.query()

const foretsUpsert = async (forets: IForet[]) =>
  Forets.query().upsertGraph(forets, { insertMissing: true })

export {
  departementsGet,
  communesUpsert,
  communesGet,
  paysGet,
  foretsGet,
  foretsUpsert,
  regionsGet
}
