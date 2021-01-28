import { ISubstanceLegale } from '../../types'
import Substances from '../models/substances'
import SubstancesLegales from '../models/substances-legales'
import options from './_options'

const substancesGet = async () =>
  Substances.query().withGraphFetched(options.substances.graph).orderBy('nom')

const substanceGet = async (id: string) =>
  Substances.query().findById(id).withGraphFetched(options.substances.graph)

const substancesLegalesGet = async ({ distinct }: { distinct: string }) => {
  const query = SubstancesLegales.query()
  if (distinct) {
    query.distinctOn(distinct)
  }

  return query
}

const substanceFiscaleCreate = async (substanceLegale: ISubstanceLegale) =>
  SubstancesLegales.query().insertAndFetch(substanceLegale)

export {
  substancesGet,
  substanceGet,
  substancesLegalesGet,
  substanceFiscaleCreate
}
