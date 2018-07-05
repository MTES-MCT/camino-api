const Statuts = require('../models/statuts')

const queries = {
  statuts: async () => Statuts.query()
}

module.exports = queries
