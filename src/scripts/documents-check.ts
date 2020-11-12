import 'dotenv/config'
import '../../init'
import documentsCheck from '../tools/documents/check'

documentsCheck()
  .then(() => {
    process.exit()
  })
  .catch(() => {
    process.exit(1)
  })
