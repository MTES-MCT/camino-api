require('dotenv').config({ path: '../.env' })

const connection = {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER
}
console.log('connection', connection)
const knexConfig = {
  development: {
    client: 'pg',
    connection,
    debug: true,
    migrations: {
      directory: '../_tools/knex/migrations'
    },
    seeds: {
      directory: '../_tools/knex/seeds'
    }
  },
  production: {
    client: 'pg',
    connection
  }
}

module.exports = knexConfig
