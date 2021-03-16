import '../init'
import demarchesDefinitionsCheck from '../tools/demarches/definitions-check'

demarchesDefinitionsCheck()
  .then(() => {
    process.exit()
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
