import 'dotenv/config'
import '../../database/index'

import * as PQueue from 'p-queue'
import dbProcess from './_utils/db-process'
import definitions from './definitions'

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
