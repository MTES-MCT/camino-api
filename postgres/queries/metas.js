const Types = require('../models/types')
const Domaines = require('../models/domaines')
const Statuts = require('../models/statuts')

const queries = {
  async typesGet() {
    return Types.query()
  },

  async domainesGet() {
    return Domaines.query()
  },

  async statutsGet() {
    return Statuts.query()
  }
}

module.exports = queries
