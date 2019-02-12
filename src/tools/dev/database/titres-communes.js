import 'dotenv/config'
import '../../../database/index'
import fileCreate from '../../file-create'

import { titresEtapesCommunesGet } from '../../../database/queries/titres-etapes'

async function main() {
  const titresCommunes = await titresEtapesCommunesGet()

  console.log(titresCommunes)

  await fileCreate('test.json', JSON.stringify(titresCommunes, null, 2))

  process.exit()
}

main()
