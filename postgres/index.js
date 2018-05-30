const Knex = require('knex')
const { Model } = require('objection')

const { env } = require('../conf')
const knexConf = require('../conf/knex')[env]
const knex = Knex(knexConf)

Model.knex(knex)

module.exports = knex
