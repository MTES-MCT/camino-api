import 'dotenv/config'
import '../../src/database/index'
import fileCreate from '../../src/tools/file-create'

import { titreGet } from '../../src/database/queries/titres'

async function main() {
  const res = await titreGet('m-pr-saint-pierre-2014', {}, 'super')

  await fileCreate('test-titre.json', JSON.stringify(res, null, 2))

  console.log('one', res)

  setTimeout(() => {
    console.log('two', res)

    process.exit()
  }, 1000)
}

main()
