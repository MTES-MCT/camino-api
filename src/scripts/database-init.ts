import '../init'

import { databaseInit } from '../database/init'

databaseInit()
  .then(() => {
    process.exit()
  })
  .catch(() => {
    process.exit(1)
  })
