import '../../init'

import { titreEtapeGet } from '../../database/queries/titres-etapes'
import { userSuper } from '../../database/user-super'

async function main() {
  const etape = await titreEtapeGet(
    'm-ar-adolphe-crique-centrale-2020-oct01-mfr01',
    { fields: { id: {} } },
    userSuper
  )

  console.log(etape.sectionsSpecifiques)

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
