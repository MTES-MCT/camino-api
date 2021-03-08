import 'dotenv/config'
import '../../init'

import EtapesTypesEtapesStatuts from '../../database/models/etapes-types--etapes-statuts'

async function main() {
  await EtapesTypesEtapesStatuts.query().insertGraph({
    etapeTypeId: 'rde',
    etapeStatutId: 'aco',
    ordre: 0
  })

  await EtapesTypesEtapesStatuts.query().insertGraph({
    etapeTypeId: 'dae',
    etapeStatutId: 'aco',
    ordre: 0
  })

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
