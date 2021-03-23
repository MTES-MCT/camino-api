import * as Knex from 'knex'
import * as path from 'path'
import * as knexDbManager from 'knex-db-manager'

import { knexConfig } from '../knex/config'
import { knexInstanceSet } from '../src/knex'

const dbManager = knexDbManager.databaseManagerFactory({
  knex: knexConfig,
  dbManager: {
    superUser: knexConfig.connection.user,
    superPassword: knexConfig.connection.password,
    populatePathPattern: path.join(__dirname, '../knex/seeds', '0[1-9]*.js')
  }
})

knexInstanceSet((dbManager.knexInstance() as unknown) as Knex<any, unknown[]>)

export { dbManager }
