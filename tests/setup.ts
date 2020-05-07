import { dbManager } from './init'

import * as knexConfig from '../knex/config'
import * as Knex from 'knex'

export default async () => {
  await dbManager.createDbOwnerIfNotExist()
  await dbManager.dropDb(knexConfig.connection.database)
  await dbManager.createDb(knexConfig.connection.database)
  await dbManager
    .migrateDb()
    .finally(() =>
      ((dbManager.knexInstance() as unknown) as Knex<any, unknown[]>).destroy()
    )
}
