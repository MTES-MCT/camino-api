import 'dotenv/config'
import '../../src/database/index'
import fileCreate from '../../src/tools/file-create'

import { titresDemarchesGet } from '../../src/database/queries/titres-demarches'

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

  try {
    const res = await titresDemarchesGet(
      { titresDomainesIds: ['h'], titresStatutsIds: ['ech'] },
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

    console.log('demarches.length', res.length)

    await fileCreate('test-titre-demarche.json', JSON.stringify(res, null, 2))

    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

main()
