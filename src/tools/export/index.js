require('dotenv').config()
require('../../database/index')
const PQueue = require('p-queue')
const dbProcess = require('./_utils/db-process')

const definitions = require('./definitions')

const run = async () => {
  // on utilise une queue plutôt que Promise.all
  // pour ne pas surcharger l'API de google
  const spreadSheetsPromises = definitions.map(definition => () =>
    dbProcess(definition)
  )
  const spreadSheetsQueue = new PQueue({ concurrency: 1 })
  await spreadSheetsQueue.addAll(spreadSheetsPromises)
}

run()
