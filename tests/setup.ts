import { dbManager } from './init'

import { connection } from '../knex/config'

export default async () => {
  if (process.env.TESTS_INTEGRATION) {
    await dbManager.createDbOwnerIfNotExist()
    // la base de donnée est définie dans package.json
    // par les variables d'env PGDATABASE=camino_tests JWT_SECRET=secret-tests
    await dbManager.dropDb(connection.database)
    await dbManager.createDb(connection.database)
    await dbManager.migrateDb()
    await dbManager.closeKnex()
  }
}
