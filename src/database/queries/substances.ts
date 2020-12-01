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

export { substancesGet, substanceGet, substancesLegalesGet }
