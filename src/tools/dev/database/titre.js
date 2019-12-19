import 'dotenv/config'
import '../../../database/index'
import fileCreate from '../../file-create'

import { titreGet } from '../../../database/queries/titres'

async function main() {
  const res = await titreGet('m-prx-saint-pierre-2014')

  await fileCreate('test-titre.json', JSON.stringify(res, null, 2))

  console.log('one', res)

  setTimeout(() => {
    console.log('two', res)

    process.exit()
  }, 1000)
}

main()
