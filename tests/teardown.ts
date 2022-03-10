import { dbManager } from './db-manager'

import { knexConfig } from '../src/knex/config'
import { Knex } from 'knex'

export default async () => {
  const connection = knexConfig.connection as Knex.PgConnectionConfig
  await dbManager.dropDb(connection.database)
}
