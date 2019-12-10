import Substances from '../models/substances'
import options from './_options'

const substancesGet = async () =>
  Substances.query()
    .withGraphFetched(options.substances.graph)
    .orderBy('nom')

const substanceGet = async id =>
  Substances.query()
    .findById(id)
    .withGraphFetched(options.substances.graph)

export { substancesGet, substanceGet }
