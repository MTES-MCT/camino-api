const Substances = require('../models/substances')

const substances = async (args, context) => Substances.query().eager('legal')

const substance = async (id, context) =>
  Substances.query()
    .findById(id)
    .eager('legal')

module.exports = {
  substance,
  substances
}
