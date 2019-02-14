import 'dotenv/config'
import * as PQueue from 'p-queue'
import spreadsheetToJson from './spreadsheet-to-json'
import fileCreate from '../file-create'
import spreadsheets from './spreadsheets'

const run = async () => {
  // construit un tableau de promesses
  // de requêtes à Google Spreadsheets
  const spreadSheetsPromises = spreadsheets.map(s => () =>
    spreadsheetsProcess(s)
  )

  // exécute les requêtes en série
  // avec PQueue plutôt que Promise.all
  // pour ne pas surcharger l'API de google
  const spreadSheetsQueue = new PQueue({ concurrency: 1 })
  await spreadSheetsQueue.addAll(spreadSheetsPromises)
}

// retourne un tableau de promesses par spreadsheet
// une promesse par onglet de la spreadsheet
const spreadsheetsProcess = async spreadsheet =>
  Promise.all([
    ...spreadsheet.tables.map(table => {
      const filePath = filePathCreate(
        spreadsheet.prefixFileName
          ? `${spreadsheet.name}-${table.name}`
          : table.name
      )

      return spreadsheet.id
        ? // si l'id de la spreadsheet est renseignée
          spreadsheetToJson(filePath, spreadsheet.id, table.name, table.cb)
        : // si l'id est absente on créé un fichier vide
          fileCreate(filePath, JSON.stringify([], null, 2))
    })
  ])

const filePathCreate = fileName =>
  `./sources/${fileName.replace(/_/g, '-')}.json`

run()
