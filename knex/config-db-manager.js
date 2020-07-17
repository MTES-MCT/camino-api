require('dotenv').config()
const knex = require('./config')

const dbManagerConfig = {
  knex,
  dbManager: {
    superUser: knex.connection.user,
    superPassword: knex.connection.password
  }
}

module.exports = dbManagerConfig
