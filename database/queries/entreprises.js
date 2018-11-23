const Entreprises = require('../models/entreprises')
const options = require('./_options')

const queries = {
  async entrepriseGet(id) {
    return Entreprises.query()
      .findById(id)
      .eager(options.entreprises.eager)
  },
  async entreprisesGet({ noms }) {
    const q = Entreprises.query()
      .skipUndefined()
      .eager(options.entreprises.eager)

    return q
  }
}

module.exports = queries
