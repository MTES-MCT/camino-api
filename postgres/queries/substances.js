const Substances = require('../models/substances')

const substances = async (args, user) =>
  Substances.query().eager('[legal, domaine]')

const substance = async (id, user) =>
  Substances.query()
    .findById(id)
    .eager('[legal, domaine]')

module.exports = {
  substance,
  substances
}
