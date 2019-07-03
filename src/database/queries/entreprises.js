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

const entrepriseUpdate = async entreprise =>
  Entreprises.query()
    .eager(options.entreprises.eager)
    .upsertGraph(entreprise, options.entreprises.update)

export { entrepriseGet, entreprisesGet, entrepriseUpdate }
