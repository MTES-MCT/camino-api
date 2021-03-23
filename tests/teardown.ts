import { dbManager } from './init-db-manager'

import { knexConfig } from '../knex/config'

export default async () => {
  await dbManager.dropDb(knexConfig.connection.database)
}
