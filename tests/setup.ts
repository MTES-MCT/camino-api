import 'dotenv/config'

import './app'
import { dbManager } from './db-manager'
import { connection } from '../knex/config'
import { mailjet } from '../src/tools/api-mailjet'

export default async () => {
  mailjet.post('send', { version: 'v3.1', perform_api_call: false })
  await dbManager.createDbOwnerIfNotExist()
  // la base de donnée est définie dans packageon
  // par les variables d'env PGDATABASE=camino_tests
  await dbManager.dropDb(connection.database)
  await dbManager.createDb(connection.database)
  await dbManager.migrateDb()
  await dbManager.closeKnex()
}
