import 'dotenv/config'
import { join } from 'path'
import { knexSnakeCaseMappers } from 'objection'

const connection = {
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD
}

const knexConfig = {
  client: 'pg',
  connection,
  migrations: {
    directory: join(__dirname, './migrations'),
    stub: join(__dirname, './migration-stub.ts')
  },
  seeds: {
    directory: join(__dirname, './seeds')
  },
  // génère les nouveaux fichiers de migrations en Typescript
  extension: 'ts',
  ...knexSnakeCaseMappers()
}

export { knexConfig, connection }
