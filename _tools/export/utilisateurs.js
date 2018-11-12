require('dotenv').config()
require('../../postgres/index')
const dbProcess = require('./_utils/db-process')
const definitions = require('./definitions')

const utilisateursDefinition = definitions.find(
  definition => definition.name === 'utilisateurs'
)

const run = async () => dbProcess(utilisateursDefinition)

run()
