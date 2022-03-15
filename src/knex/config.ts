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
    directory: [
      join(__dirname, './migrations-schema'),
      join(__dirname, './migrations-data')
    ],
    stub: join(__dirname, './migration-stub.js'),
    // génère les nouveaux fichiers de migrations en Javascript, car la prod éxecute les fichiers transpillés
    // Si on met du Typescript, les environnements de devs ne vont plus démarrer avec la bdd de prod.
    // https://github.com/knex/knex/issues/4688
    extension: 'js'
  },
  ...knexSnakeCaseMappers()
}

export { knexConfig, connection }
