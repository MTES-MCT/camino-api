import 'dotenv/config'
import '../../database/index'

import * as PQueue from 'p-queue'
import dbProcess from './_utils/db-process'
import spreadsheets from './spreadsheets'

const run = async () => {
  // construit un tableau de promesses avec
  // - les requête en base de données
  // - les appels à l'API Google Sheets
  const spreadSheetsPromises = spreadsheets.map(spreadsheet => () =>
    dbProcess(spreadsheet)
  )

  // utilise une queue plutôt que Promise.all
  // pour ne pas surcharger l'API de google
  const spreadSheetsQueue = new PQueue({ concurrency: 1 })
  await spreadSheetsQueue.addAll(spreadSheetsPromises)
}

run()
