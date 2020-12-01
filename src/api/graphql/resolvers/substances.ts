import {
  substanceGet,
  substancesGet,
  substancesLegalesGet
} from '../../../database/queries/substances'

const substance = async ({ id }: { id: string }) => substanceGet(id)

const substancesLegales = async () => substancesLegalesGet({ distinct: 'nom' })

const substances = async () => substancesGet()

export { substance, substances, substancesLegales }
