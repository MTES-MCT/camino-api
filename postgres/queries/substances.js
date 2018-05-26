const Substances = require('../models/substances')

const substances = async (args, user) => Substances.query().eager('legal')

const substance = async (id, user) =>
  Substances.query()
    .findById(id)
    .eager('legal')

module.exports = {
  substance,
  substances
}
