import 'dotenv/config'
import { knexSnakeCaseMappers } from 'objection'

import { knexInit } from './knex'

const connection = {
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD
}

const knexConfig = {
  client: 'pg',
  // debug: true,
  connection,
  ...knexSnakeCaseMappers()
}

knexInit(knexConfig)
