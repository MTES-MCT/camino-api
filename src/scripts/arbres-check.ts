import 'dotenv/config'
import '../init'
import demarchesEtatsDefinitionsCheck from '../tools/demarches-etats-definitions/check'

demarchesEtatsDefinitionsCheck()
  .then(() => {
    process.exit()
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
