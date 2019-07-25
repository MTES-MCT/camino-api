import { knexSnakeCaseMappers } from 'objection'

const connection = {
  database: process.env.PGDATABASE,
  host: process.env.PGHOST,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT),
  user: process.env.PGUSER
}

const knexConfig = {
  client: 'pg',
  // debug: true,
  connection,
  ...knexSnakeCaseMappers()
}

export default knexConfig
