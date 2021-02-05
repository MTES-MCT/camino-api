import 'dotenv/config'
import '../../src/init'

import Entreprises from '../../src/database/models/entreprises'

const main = async () => {
  const entreprisesUpdatedCount = await Entreprises.query()
    .patch({ archive: true })
    // Entreprises inconnues créées pour RNTM
    .orWhere('id', 'like', 'xx-1%')
    // Entreprises inconnues créées pour Mimausa
    .orWhere('id', 'like', 'xx-2%')

  console.log(`${entreprisesUpdatedCount} entreprises archivées`)

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
