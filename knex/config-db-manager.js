require('dotenv').config()
const knex = require('./config')

const knexDbManagerConfig = {
  knex,
  dbManager: {
    superUser: knex.connection.user,
    superPassword: knex.connection.password
  }
}

module.exports = knexDbManagerConfig
