import 'dotenv/config'
import './init'
import { dbManager } from './init-db-manager'
import { connection } from '../knex/config'

export default async () => {
  await dbManager.createDbOwnerIfNotExist()
  // la base de donnée est définie dans package.json
  // par les variables d'env PGDATABASE=camino_tests
  await dbManager.dropDb(connection.database)
  await dbManager.createDb(connection.database)
  await dbManager.migrateDb()
  await dbManager.closeKnex()
}
