require('dotenv').config()
const { knexConfig, connection } = require('./config')

const dbManagerConfig = {
  knex: knexConfig,
  dbManager: {
    superUser: connection.user,
    superPassword: connection.password
  }
}

module.exports = { dbManagerConfig }
