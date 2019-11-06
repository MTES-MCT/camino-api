import Entreprises from '../models/entreprises'
import options from './_options'

const entrepriseGet = async (id, { eager = options.entreprises.eager } = {}) =>
  Entreprises.query()
    .findById(id)
    .eager(eager)

const entreprisesGet = async (
  args,
  { eager = options.entreprises.eager } = {}
) =>
  Entreprises.query()
    .skipUndefined()
    .eager(eager)

const entreprisesUpsert = async entreprises =>
  Entreprises.query()
    .eager(options.entreprises.eager)
    .upsertGraph(entreprises, options.entreprises.update)

const entrepriseUpsert = async entreprise =>
  Entreprises.query()
    .eager(options.entreprises.eager)
    .upsertGraph(entreprise, options.entreprises.update)
    .returning('*')

export { entrepriseGet, entreprisesGet, entreprisesUpsert, entrepriseUpsert }
