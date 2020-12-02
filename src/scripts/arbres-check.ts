import 'dotenv/config'
import '../init'
import arbresCheck from '../tools/arbres/check'

arbresCheck()
  .then(() => {
    process.exit()
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
