require('dotenv').config()
require('../../postgres/index')
const PQueue = require('p-queue')
const jsonToSpreadsheet = require('./_utils/json-to-spreadsheet')

const credentials = require('./credentials')
const definitions = require('./definitions')

const run = async () => {
  // on utilise une queue plutôt que Promise.all
  // pour ne pas surcharger l'API de google
  const spreadSheetsPromises = definitions.map(d => () => dbProcess(d))
  const spreadSheetsQueue = new PQueue({ concurrency: 1 })
  await spreadSheetsQueue.addAll(spreadSheetsPromises)
}

const dbProcess = async s => {
  const content = await s.fetch
  await jsonToSpreadsheet(s.id, credentials, s.tables, content)
}

run()
