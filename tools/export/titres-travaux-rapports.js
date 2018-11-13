require('dotenv').config()
require('../../postgres/index')
const dbProcess = require('./_utils/db-process')

const definitions = require('./definitions')
const titresTravauxRapportsDefinition = definitions.find(
  definition => definition.name === 'titres-travaux-rapports'
)

const run = async () => dbProcess(titresTravauxRapportsDefinition)

run()
