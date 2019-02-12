import 'dotenv/config'
import '../../../database/index'

import fileCreate from '../../file-create'

import { titresDemarchesGet } from '../../../database/queries/titres-demarches'

async function main() {
  const res = await titresDemarchesGet({
    titresIds: ['h-cxx-courdemanges-1988'],
    demarchesIds: undefined
  })

  await fileCreate('test.json', JSON.stringify(res, null, 2))

  console.log(res)

  process.exit()
}

main()
