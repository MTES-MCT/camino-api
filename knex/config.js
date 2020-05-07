require('dotenv').config({ path: '../.env' })
const { knexSnakeCaseMappers } = require('objection')
const { join } = require('path')

const connection = {
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD
}

const knex = {
  client: 'pg',
  connection,
  migrations: {
    directory: join(__dirname, 'migrations')
  },
  seeds: {
    directory: join(__dirname, './seeds')
  },
  ...knexSnakeCaseMappers()
}

module.exports = knex
