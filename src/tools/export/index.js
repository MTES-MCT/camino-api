import 'dotenv/config'
import '../../database/index'
import PQueue from 'p-queue'

import dbToSpreadsheet from './_utils/db-to-spreadsheets'
import spreadsheetsTitres from './spreadsheets/titres'
import spreadsheetUtilisateurs from './spreadsheets/utilisateurs'
import spreadsheetActivites from './spreadsheets/titres-activites'
import spreadsheetAdministrations from './spreadsheets/administrations'

const run = async () => {
  console.log('Export en cours…')

  // construit un tableau de promesses avec
  // - les requête en base de données
  // - les appels à l'API Google Sheets
  const spreadsheetsPromises = [
    ...spreadsheetsTitres,
    spreadsheetUtilisateurs,
    spreadsheetActivites,
    spreadsheetAdministrations
  ].map(({ id, name, get, tables }) => () =>
    dbToSpreadsheet({
      id,
      name,
      get,
      tables
    })
  )

  // utilise une queue plutôt que Promise.all
  // pour ne pas surcharger l'API de google
  const queue = new PQueue({
    concurrency: 1,
    intervalCap: 1,
    interval: 1000
  })

  try {
    await queue.addAll(spreadsheetsPromises)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }

  console.log('Export terminé')
  process.exit()
}

run()
