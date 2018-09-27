const Types = require('../models/types')
const Domaines = require('../models/domaines')
const Statuts = require('../models/statuts')

const types = async () => Types.query()
const domaines = async () => Domaines.query()
const statuts = async () => Statuts.query()

module.exports = {
  types,
  domaines,
  statuts
}
