import 'dotenv/config'
import '../../src/database/index'
import fileCreate from '../../src/tools/file-create'

import { titreDemarcheGet } from '../../src/database/queries/titres-demarches'

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

  // non-logué
  const userId = undefined

  // titre echu public
  // const id = 'm-ar-sainte-helene-2019'

  // titre non-public
  const titreId =
    'm-ar-crique-grand-bagot-bistouri-et-petit-bagot-boeuf-mort-2019'

  const res = await titreDemarcheGet(
    `${titreId}-oct01`,
    {
      fields: {
        etapes: {
          type: { autorisations: { id: {} } },
          titulaires: { utilisateurs: { id: {} } }
        }
      }
    },
    userId
  )

  await fileCreate('test-titre-demarche.json', JSON.stringify(res, null, 2))

  process.exit(0)
}

main()
