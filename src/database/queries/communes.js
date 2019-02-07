import Communes from '../models/communes'

const communesGet = async () => Communes.query()

const communeInsert = async commune => Communes.query().insert(commune)

export { communeInsert, communesGet }
