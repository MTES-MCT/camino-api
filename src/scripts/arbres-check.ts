import 'dotenv/config'
import '../init'
import arbresDemarchesCheck from '../tools/arbres-demarches/check'

arbresDemarchesCheck()
  .then(() => {
    process.exit()
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
