import { ICommune, IForet } from '../../types'

import Communes from '../models/communes'
import Departements from '../models/departements'
import Pays from '../models/pays'
import Forets from '../models/forets'

import options from './_options'

const paysGet = async () => Pays.query().withGraphFetched(options.pays.graph)
const departementsGet = async () => Departements.query()

const communesGet = async (): Promise<ICommune[]> =>
  Communes.query().withGraphFetched(options.communes.graph)

const communesUpsert = async (communes: ICommune[]) =>
  Communes.query().upsertGraph(communes, { insertMissing: true })

const foretsGet = async () => Forets.query()

const foretsUpsert = async (forets: IForet[]) =>
  Forets.query().upsertGraph(
    forets.map(f => ({ id: f.id, nom: f.nom })),
    { insertMissing: true }
  )

export {
  departementsGet,
  communesUpsert,
  communesGet,
  paysGet,
  foretsGet,
  foretsUpsert
}
