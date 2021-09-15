import Knex from 'knex'
import path from 'path'
import knexDbManager from 'knex-db-manager'

import { knexConfig } from '../src/knex/config'
import { knexInstanceSet } from '../src/knex'

const dbManager = knexDbManager.databaseManagerFactory({
  knex: knexConfig,
  dbManager: {
    superUser: knexConfig.connection.user,
    superPassword: knexConfig.connection.password,
    populatePathPattern: path.join(__dirname, '../src/knex/seeds', '0[1-9]*')
  }
})

knexInstanceSet(dbManager.knexInstance() as unknown as Knex<any, unknown[]>)

export { dbManager }
