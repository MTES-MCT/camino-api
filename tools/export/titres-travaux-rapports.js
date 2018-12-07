require('dotenv').config()
require('../../database/index')
const dbProcess = require('./_utils/db-process')

const definitions = require('./definitions')
const titresTravauxRapportsDefinition = definitions.find(
  definition => definition.name === 'titres-travaux-rapports'
)

const run = async () => {
  const res = await dbProcess(titresTravauxRapportsDefinition)
  console.log(res)
  process.exit()
}

run()
