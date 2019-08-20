import TitreTaxes from '../models/titres-taxes'
import options from './_options'
// import * as sqlFormatter from 'sql-formatter'

const titreTaxeGet = async id =>
  await TitreTaxes.query()
    .graph(options.titresTaxes.graph)
    .findById(id)
    .first()

const titresTaxesGet = async () =>
  await TitreTaxes.query().graph(options.titresTaxes.graph)

const titreTaxeUpdate = async (id, props) =>
  await TitreTaxes.query()
    .graph(options.titresTaxes.graph)
    .patchAndFetchById(id, props)

const titreTaxesUpsert = async titreTaxes =>
  await TitreTaxes.query()
    .graph(options.titresTaxes.graph)
    .upsertGraph(titreTaxes, { insertMissing: true })

export { titreTaxeGet, titreTaxesUpsert, titresTaxesGet, titreTaxeUpdate }
