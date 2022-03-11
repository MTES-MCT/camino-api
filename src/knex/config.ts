import 'dotenv/config'
import { join } from 'path'
import { knexSnakeCaseMappers } from 'objection'
import { Knex } from 'knex'
import PgConnectionConfig = Knex.PgConnectionConfig

const connection = {
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD
}

interface MyKnexConfig {
  connection: PgConnectionConfig
}
const knexConfig: Required<Pick<Knex.Config, 'migrations'>> &
  Omit<Knex.Config, 'migrations'> &
  MyKnexConfig = {
  client: 'pg',
  connection,
  migrations: {
    directory: [
      join(__dirname, './migrations-schema'),
      join(__dirname, './migrations-data')
    ],
    stub: join(__dirname, './migration-stub.ts'),
    extension: 'ts'
  },
  seeds: {
    directory: join(__dirname, './seeds')
  },
  ...knexSnakeCaseMappers()
}

export { knexConfig, connection }
