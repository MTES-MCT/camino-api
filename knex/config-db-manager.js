require('dotenv').config()
const knex = require('./config')

// le chemin d'ou est appelé le fichier
knex.migrations.directory = './knex/migrations'
knex.seeds.directory = './knex/seeds'

const knexDbManagerConfig = {
  knex,
  dbManager: {
    superUser: knex.connection.user,
    superPassword: knex.connection.password
  }
}

module.exports = knexDbManagerConfig
