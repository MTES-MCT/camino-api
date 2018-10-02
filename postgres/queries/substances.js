const Substances = require('../models/substances')
const options = require('./_options')

const substances = async args =>
  Substances.query().eager(options.substances.eager)

const substance = async id =>
  Substances.query()
    .findById(id)
    .eager(options.substances.eager)

module.exports = {
  substance,
  substances
}
