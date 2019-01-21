require('dotenv').config()
require('../../../database/index')

const fileCreate = require('../../import/_utils/file-create.js')

const { demarchesTypesGet } = require('../../../database/queries/metas')

async function main() {
  const res = await demarchesTypesGet()

  await fileCreate('test.json', JSON.stringify(res, null, 2))

  console.log(res)

  process.exit()
}

main()
