import '../init'

import init from '../database/init'

init()
  .then(() => {
    process.exit()
  })
  .catch(() => {
    process.exit(1)
  })
