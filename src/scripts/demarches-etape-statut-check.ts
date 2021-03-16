import '../init'
import { etapeStatutCheck } from '../tools/demarches/etape-statut-check'

etapeStatutCheck()
  .then(() => {
    process.exit()
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
