import 'dotenv/config'
import '../init'

import daily from '../business/daily'

daily()
  .then(() => {
    process.exit()
  })
  .catch(() => {
    process.exit(1)
  })
