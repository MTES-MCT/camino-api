const Substances = require('../models/substances')
const options = require('./_options')

const queries = {
  async substancesGet() {
    return Substances.query()
      .eager(options.substances.eager)
      .orderBy('nom')
  },

  async substanceGet(id) {
    return Substances.query()
      .findById(id)
      .eager(options.substances.eager)
  }
}

module.exports = queries
