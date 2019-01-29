require('dotenv').config()
require('../../database/index')
const dbProcess = require('./_utils/db-process')
const definitions = require('./definitions')

const utilisateursDefinition = definitions.find(
  definition => definition.name === 'utilisateurs'
)

const run = async () => {
  const res = await dbProcess(utilisateursDefinition)
  console.log(res)
  process.exit()
}

run()
