import 'dotenv/config'
import '../../../database/index'

import { titresGet, titreIdUpdate } from '../../../database/queries/titres'
import { titreIdCheck } from '../../../business/processes/titres-ids-update'
import titreIdAndRelationsUpdate from '../../../business/utils/titre-id-and-relations-update'

async function main() {
  const titres = await titresGet()

  for (let titre of titres) {
    const titreOldId = titre.id
    try {
      // met à jour les ids de titre par effet de bord
      const { hasChanged } = titreIdAndRelationsUpdate(titre)

      if (!hasChanged) return null

      titre = await titreIdCheck(titreOldId, titre)
      await titreIdUpdate(titreOldId, titre)

      console.log(`mise à jour: titre ids: ${titre.id}`)
    } catch (e) {
      console.error(`erreur: titreIdsUpdate ${titreOldId}`)
      console.error(e)
    }
  }
}

main()
