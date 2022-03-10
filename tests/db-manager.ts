import { Knex } from 'knex'
import { databaseManagerFactory } from 'knex-db-manager'
import { join } from 'path'

import { knexConfig } from '../src/knex/config'
import { knexInstanceSet } from '../src/knex'

// pour les tests on lance que les migrations du schéma
// src/knex/migrations-schema
knexConfig.migrations.directory = [
  join(__dirname, '../src/knex/migrations-schema')
]

const connection = knexConfig.connection as Knex.PgConnectionConfig
const dbManager = databaseManagerFactory({
  knex: knexConfig,
  dbManager: {
    superUser: connection.user,
    superPassword: connection.password,
    populatePathPattern: join(__dirname, '../src/knex/seeds', '0[1-9]*')
  }
})

knexInstanceSet(dbManager.knexInstance() as unknown as Knex<any, unknown[]>)

export { dbManager }
