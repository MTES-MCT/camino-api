import { dbManager } from './db-manager'

import { knexConfig } from '../src/knex/config'

export default async () => {
  await dbManager.dropDb(knexConfig.connection.database)
}
