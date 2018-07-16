const Types = require('../models/types')
const Domaines = require('../models/domaines')
const Statuts = require('../models/statuts')

const queries = {
  types: async () => Types.query(),
  domaines: async () => Domaines.query(),
  statuts: async () => Statuts.query()
}

module.exports = queries
