import 'dotenv/config'
import '../../../database/index'

import fileCreate from '../../file-create'

import { demarchesTypesGet } from '../../../database/queries/metas'

async function main() {
  const res = await demarchesTypesGet()

  await fileCreate('test.json', JSON.stringify(res, null, 2))

  console.log(res)

  process.exit()
}

main()
