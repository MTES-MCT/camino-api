const Entreprises = require('../models/entreprises')
const options = require('./_options')

const entrepriseGet = async id =>
  Entreprises.query()
    .findById(id)
    .eager(options.entreprises.eager)

const entreprisesGet = async ({ noms }) => {
  const q = Entreprises.query()
    .skipUndefined()
    .eager(options.entreprises.eager)

  return q
}

module.exports = {
  entrepriseGet,
  entreprisesGet
}
