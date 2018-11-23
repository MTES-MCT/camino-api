require('dotenv').config()
require('../../database/index')
const dbProcess = require('./_utils/db-process')
const definitions = require('./definitions')

const utilisateursDefinition = definitions.find(
  definition => definition.name === 'utilisateurs'
)

const run = async () => {
  await dbProcess(utilisateursDefinition)
  process.exit(1)
}

run()
