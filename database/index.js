const Knex = require('knex')
const { Model } = require('objection')

const knexConfig = require('../config/knex')
const knex = Knex(knexConfig)

Model.knex(knex)

module.exports = knex
