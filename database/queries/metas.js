const Types = require('../models/types')
const Domaines = require('../models/domaines')
const Statuts = require('../models/statuts')
const DemarchesTypes = require('../models/demarches-types')
const options = require('./_options')

const queries = {
  async typesGet() {
    return Types.query()
  },

  async domainesGet() {
    return Domaines.query()
  },

  async statutsGet() {
    return Statuts.query()
  },

  async demarchesTypesGet() {
    return DemarchesTypes.query().eager(options.demarchesTypes.eager)
  }
}

module.exports = queries
