import '../init'

import { databaseToJsonExport } from '../tools/database-to-json/index'

databaseToJsonExport()
  .then(() => {
    process.exit()
  })
  .catch(() => {
    process.exit(1)
  })
