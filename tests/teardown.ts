import { dbManager } from './init'

import { knexConfig } from '../knex/config'

export default async () => {
  if (process.env.TESTS_INTEGRATION) {
    await dbManager.dropDb(knexConfig.connection.database)
  }
}
