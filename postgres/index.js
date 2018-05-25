const Knex = require('knex')
const knexConf = require('../conf/knex')[process.env.NODE_ENV]
const { Model } = require('objection')
const knex = Knex(knexConf)

Model.knex(knex)

module.exports = knex
