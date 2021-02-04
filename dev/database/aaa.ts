import 'dotenv/config'
import '../../src/init'

import { IAdministration, ITitre } from '../../src/types'
import { titreGet } from '../../src/database/queries/titres'

const main = async () => {
  const userId = '6c3a63'
  const titreId = 'm-ar-abattis-kotika-2006'
  const titre = await titreGet(titreId, {}, userId)
  console.log(titre)

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
