import Entreprises from '../models/entreprises'
import options from './_options'

const entrepriseGet = async id =>
  Entreprises.query()
    .findById(id)
    .eager(options.entreprises.eager)

const entreprisesGet = async () =>
  Entreprises.query()
    .skipUndefined()
    .eager(options.entreprises.eager)

const entrepriseUpdate = async entreprise =>
  Entreprises.query()
    .eager(options.entreprises.eager)
    .upsertGraph(entreprise, options.entreprises.update)

export { entrepriseGet, entreprisesGet, entrepriseUpdate }
