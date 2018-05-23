// require('dotenv').config({ path: '../.env' })

module.exports = {
  client: 'pg',
  connection: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER
  },
  debug: true,
  migrations: {
    directory: '../_tools/knex/migrations'
  },
  seeds: {
    directory: '../_tools/knex/seeds'
  }
}
