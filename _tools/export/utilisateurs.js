require('dotenv').config()
require('../../postgres/index')
const jsonToSpreadsheet = require('./_utils/json-to-spreadsheet')

const credentials = require('./credentials')
const definitions = require('./definitions')
const utilisateursDefinition = definitions.find(
  definition => definition.name === 'utilisateurs'
)

const run = async () => {
  await dbProcess(utilisateursDefinition)
}

const dbProcess = async definition => {
  const content = await definition.fetch
  await jsonToSpreadsheet(
    definition.id,
    credentials,
    definition.tables,
    content
  )
}

run()
