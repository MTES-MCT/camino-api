import TitreTaxes from '../models/titres-taxes'
import options from './_options'
import { titreTaxeFormat } from './_format'
// import * as sqlFormatter from 'sql-formatter'

const titreTaxeGet = async id => {
  const tt = await TitreTaxes.query()
    .eager(options.titresTaxes.eager)
    .findById(id)
    .first()

  return tt && titreTaxeFormat(tt)
}

const titresTaxesGet = async () => {
  const tts = await TitreTaxes.query().eager(options.titresTaxes.eager)

  return tts.map(tt => titreTaxeFormat(tt))
}

const titreTaxeUpdate = async (id, props) => {
  const tt = await TitreTaxes.query()
    .eager(options.titresTaxes.eager)
    .patchAndFetchById(id, props)

  return tt && titreTaxeFormat(tt)
}

const titreTaxesUpsert = async titreTaxes => {
  const tts = await TitreTaxes.query()
    .eager(options.titresTaxes.eager)
    .upsertGraph(titreTaxes, { insertMissing: true })

  return tts.map(tt => titreTaxeFormat(tt))
}

export { titreTaxeGet, titreTaxesUpsert, titresTaxesGet, titreTaxeUpdate }
