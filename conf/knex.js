require('dotenv').config({ path: '../.env' })

module.exports = {
  client: 'pg',
  connection: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB_NAME
  },
  debug: true,
  migrations: {
    directory: '../_tools/knex/migrations'
  },
  seeds: {
    directory: '../_tools/knex/seeds'
  }
}
