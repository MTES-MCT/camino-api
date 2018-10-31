require('dotenv').config()
require('../../postgres/index')
const jsonToSpreadsheet = require('./_utils/json-to-spreadsheet')

const credentials = require('./credentials')
const spreadsheets = require('./spreadsheets')
const utilisateursSpreadsheet = spreadsheets.find(
  s => s.name === 'utilisateurs'
)

const run = async () => {
  await dbProcess(utilisateursSpreadsheet)
}

const dbProcess = async s => {
  const content = await s.fetch
  await jsonToSpreadsheet(s.id, credentials, s.tables, content)
}

run()
