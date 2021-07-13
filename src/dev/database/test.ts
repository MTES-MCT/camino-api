import '../../init'

import { userSuper } from '../../database/user-super'
import { titreEtapeGet } from '../../database/queries/titres-etapes'
import { titreTypeDemarcheTypeEtapeTypeGet } from '../../database/queries/metas'

async function main() {
  const tde = await titreTypeDemarcheTypeEtapeTypeGet(
    {
      titreTypeId: 'arm',
      demarcheTypeId: 'oct',
      etapeTypeId: 'mfr'
    },
    {}
  )

  console.log(tde)

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
