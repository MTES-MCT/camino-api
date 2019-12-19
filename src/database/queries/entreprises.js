import Entreprises from '../models/entreprises'
import options from './_options'

const entrepriseGet = async (id, { graph = options.entreprises.graph } = {}) =>
  Entreprises.query()
    .findById(id)
    .withGraphFetched(graph)

const entreprisesGet = async (
  args,
  { graph = options.entreprises.graph } = {}
) =>
  Entreprises.query()
    .skipUndefined()
    .withGraphFetched(graph)
    .orderBy('nom')

const entreprisesUpsert = async entreprises =>
  Entreprises.query()
    .withGraphFetched(options.entreprises.graph)
    .upsertGraph(entreprises, options.entreprises.update)

const entrepriseUpsert = async entreprise =>
  Entreprises.query()
    .withGraphFetched(options.entreprises.graph)
    .upsertGraph(entreprise, options.entreprises.update)
    .returning('*')

export { entrepriseGet, entreprisesGet, entreprisesUpsert, entrepriseUpsert }
