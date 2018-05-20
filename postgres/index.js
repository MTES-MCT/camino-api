const Knex = require('knex')
const knexfile = require('../conf/knex')
// const { Model } = require('objection')

const knex = Knex(knexfile)

// Model.knex(knex)

module.exports = knex
