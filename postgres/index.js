const Knex = require('knex')
const knexConf = require('../conf/knex')
const { Model } = require('objection')
const knex = Knex(knexConf)

Model.knex(knex)

module.exports = knex
