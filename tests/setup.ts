import 'dotenv/config'

import './app'
import { join } from 'path'
import { dbManager } from './db-manager'
import { connection } from '../src/knex/config'
import { mailjet } from '../src/tools/api-mailjet'

export default async () => {
  mailjet.post('send', { version: 'v3.1', perform_api_call: false })
  await dbManager.createDbOwnerIfNotExist()
  // la base de donnée est définie dans packageon
  // par les variables d'env PGDATABASE=camino_tests
  await dbManager.dropDb(connection.database)
  await dbManager.createDb(connection.database)

  // ugly hack : jest n’arrive pas a lancer les migration en typescript pendant son setup.
  // On lance donc les migrations transpilées du dossier dist
  await (dbManager.knexInstance() as any).migrate.latest({
    directory: join(__dirname, '../dist/knex/migrations')
  })

  await dbManager.closeKnex()
}
