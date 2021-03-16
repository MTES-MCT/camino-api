import '../init'
import { titreTypeDemarcheTypeEtapeTypeCheck } from '../tools/demarches/tde-check'

titreTypeDemarcheTypeEtapeTypeCheck()
  .then(() => {
    process.exit()
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
