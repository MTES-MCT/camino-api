import '../../init'
import fileCreate from '../../tools/file-create'

import { titresDemarchesGet } from '../../database/queries/titres-demarches'
import { userGet } from '../../database/queries/utilisateurs'

async function main() {
  const userId = 'super'

  // admin dea-guyane-01
  // const userId = 'f5922d'

  // admin dea-guyane-01 et ONF
  // const userId = 'f455dd'

  // admin onf uniquement
  // const userId = '5c0d2b'

  // admin ptmg uniquement
  // const userId = '1ee94a'

  // admin dgpr
  // const userId = '80dcfd'

  // entreprise titulaire sainte-helene
  // const userId = 'd343f9'

  // entreprise titulaire boeuf mort
  // const userId = '8e8a19'

  // entreprise titulaire d'auror
  // const userId = 'd6378e'

  // non-logué
  // const userId = undefined

  // titre echu public
  // const titreId = 'm-ar-sainte-helene-2019'

  // titre non-public
  // const titreId =
  //   'm-ar-crique-grand-bagot-bistouri-et-petit-bagot-boeuf-mort-2019'

  // titre avec activités
  // const titreId = 'm-ax-auror-2018'

  try {
    console.time('demarches')

    console.info({ userId })
    const user = await userGet(userId)
    const res = await titresDemarchesGet(
      { titresDomainesIds: ['m'], titresStatutsIds: ['ech'] },
      { fields: {} },
      user
    )

    console.timeEnd('demarches')

    console.info('demarches.length', res && res.length)

    await fileCreate(
      'dev/tmp/test-titre-demarche.json',
      JSON.stringify(res, null, 2)
    )

    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

main()
