import Substances from '../models/substances'
import options from './_options'

const substancesGet = async () =>
  Substances.query()
    .eager(options.substances.eager)
    .orderBy('nom')

const substanceGet = async id =>
  Substances.query()
    .findById(id)
    .eager(options.substances.eager)

export { substancesGet, substanceGet }
