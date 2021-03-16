import 'dotenv/config'

import knex from '../init'
import { databaseToJsonExport } from '../tools/database-to-json'

databaseToJsonExport(knex)
  .then(() => {
    process.exit()
  })
  .catch(() => {
    process.exit(1)
  })
