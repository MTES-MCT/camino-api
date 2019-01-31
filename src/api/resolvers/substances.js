import { substanceGet, substancesGet } from '../../database/queries/substances'

const substance = async ({ id }, context) => substanceGet(id)

const substances = async (_, context) => substancesGet()

export { substance, substances }
