import 'dotenv/config'
import ssImport from '../tools/ss-import'

ssImport()
  .then(() => {
    process.exit()
  })
  .catch(() => {
    process.exit(1)
  })
