import 'dotenv/config'
import knex from '../../init'

import EtapesStatuts from '../../database/models/etapes-statuts'
import EtapesTypesEtapesStatuts from '../../database/models/etapes-types--etapes-statuts'

async function main() {
  await knex.schema.alterTable('etapesStatuts', table => {
    table.dropColumn('ordre')
  })

  await EtapesStatuts.query().insertGraph({
    id: 'aco',
    nom: 'en construction',
    couleur: 'warning'
  })

  await EtapesTypesEtapesStatuts.query().insertGraph({
    etapeTypeId: 'mfr',
    etapeStatutId: 'aco',
    ordre: 1
  })

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
