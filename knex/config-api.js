require('dotenv').config()
const { knexSnakeCaseMappers } = require('objection')

const connection = {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD
}

const knexConfig = {
  knex: {
    client: 'pg',
    connection,
    migrations: {
      directory: './knex/migrations'
    },
    seeds: {
      directory: './knex/seeds'
    },
    ...knexSnakeCaseMappers()
  },
  dbManager: {
    superUser: connection.user,
    superPassword: connection.password
  }
}

module.exports = knexConfig
