import 'dotenv/config'
import '../../src/database/index'
import fileCreate from '../../src/tools/file-create'

import { titreGet } from '../../src/database/queries/titres'

async function main() {
  // const userId = 'super'

  // admin dea-guyane-01
  // const userId = 'f5922d'

  // admin dea-guyane-01 et ONF
  // const userId = 'f455dd'

  // entreprise titulaire sainte-helene
  // const userId = 'd343f9'

  // entreprise titulaire boeuf mort
  // const userId = '8e8a19'

  // entreprise titulaire d'auror
  const userId = 'd6378e'

  // non-logué
  // const userId = undefined

  // titre echu public
  // const titreId = 'm-ar-sainte-helene-2019'

  // titre non-public
  // const titreId =
  //   'm-ar-crique-grand-bagot-bistouri-et-petit-bagot-boeuf-mort-2019'

  // titre avec activités
  const titreId = 'm-ax-auror-2018'

  const res = await titreGet(
    titreId,
    {
      fields: {
        demarches: { etapes: { id: {} } },
        activites: { id: {} }
      }
    },
    userId
  )

  console.log('etapes:')
  console.log(res.demarches.flatMap(d => d.etapes.map(e => e.id)).join('\n'))

  console.log('activites:')
  console.log(res.activites.map(e => e.id).join('\n'))

  await fileCreate('test-titre.json', JSON.stringify(res, null, 2))

  process.exit(0)
}

main()
