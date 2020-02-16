import { substanceGet, substancesGet } from '../../database/queries/substances'

const substance = async ({ id }: { id: string }) => substanceGet(id)

const substances = async () => substancesGet()

export { substance, substances }
