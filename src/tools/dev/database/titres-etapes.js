import 'dotenv/config'
import '../../../database/index'
import { titreEtapeGet } from '../../../database/queries/titres-etapes'
import { communesGet } from '../../../database/queries/communes'

import titreEtapeCommunesUpdate from '../../../tasks/etape-update/titre-etape-communes-update'

async function main() {
  const titreEtapeId = 'h-prh-tarbes-val-d-adour-2008-pr101-dpu01'

  const titreEtape = await titreEtapeGet(titreEtapeId)

  const communes = await communesGet()
  const titresEtapesCommunes = await titreEtapeCommunesUpdate(
    titreEtape,
    communes
  )

  console.log(titresEtapesCommunes)

  process.exit()
}

main()
