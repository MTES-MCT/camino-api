import Entreprises from '../models/entreprises'
import options from './_options'

const entrepriseGet = async id =>
  Entreprises.query()
    .findById(id)
    .eager(options.entreprises.eager)

const entreprisesGet = async ({ noms }) =>
  Entreprises.query()
    .skipUndefined()
    .eager(options.entreprises.eager)

export { entrepriseGet, entreprisesGet }
