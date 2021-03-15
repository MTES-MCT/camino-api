import 'dotenv/config'
import { databaseToJsonExport } from '../tools/database-to-json'

databaseToJsonExport()
  .then(() => {
    process.exit()
  })
  .catch(() => {
    process.exit(1)
  })
