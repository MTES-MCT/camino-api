import 'dotenv/config'
import * as PQueue from 'p-queue'
import * as googleSpreadSheetToJson from 'google-spreadsheet-to-json'
import credentials from './credentials'
import fileCreate from '../file-create'
import spreadsheets from './spreadsheets'

const run = async () => {
  // construit un tableau de promesses
  // de requêtes à Google Spreadsheets
  const spreadsheetsPromises = spreadsheets.map(s => () =>
    spreadsheetsProcess(s)
  )

  // exécute les requêtes en série
  // avec PQueue plutôt que Promise.all
  // pour ne pas surcharger l'API de google
  const spreadsheetsQueue = new PQueue({ concurrency: 1 })
  await spreadsheetsQueue.addAll(spreadsheetsPromises)
}

// retourne un tableau de promesses par spreadsheet
// une promesse par onglet de la spreadsheet
const spreadsheetsProcess = async spreadsheet =>
  Promise.all([
    ...spreadsheet.tables.map(async table => {
      const spreadsheetName = `${spreadsheet.name}-${table.name}`

      console.log(`Import: ${spreadsheetName}`)

      const filePath = filePathCreate(
        spreadsheet.prefixFileName ? spreadsheetName : table.name
      )

      const json = spreadsheet.id
        ? // si l'id de la spreadsheet est renseignée,
          // on créé le json à partir de la spreadsheet
          await spreadsheetToJson(spreadsheet.id, table.name, table.cb)
        : // sinon le json est vide
          []

      return fileCreate(filePath, JSON.stringify(json, null, 2))
    })
  ])

const filePathCreate = fileName =>
  `./sources/${fileName.replace(/_/g, '-')}.json`

const spreadsheetToJson = async (spreadsheetId, worksheet, cb) => {
  try {
    let json = await googleSpreadSheetToJson({
      spreadsheetId,
      credentials,
      worksheet
    })

    if (cb) {
      json = cb(json)
    }

    return json
  } catch (err) {
    console.log(err)
  }
}

run()
