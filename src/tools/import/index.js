import 'dotenv/config'
import PQueue from 'p-queue'
import errorLog from '../error-log'
import { spreadsheetsGet } from '../api-google-spreadsheets'
import credentials from './credentials'
import fileCreate from '../file-create'
import spreadsheets from './spreadsheets'

const run = async () => {
  // construit un tableau de promesses
  // de requêtes à Google Spreadsheets
  const spreadsheetsPromises = spreadsheets.map(s => () =>
    spreadsheetToJsonFiles(s)
  )

  // exécute les requêtes en série
  // avec PQueue plutôt que Promise.all
  // pour ne pas surcharger l'API de google
  const queue = new PQueue({
    concurrency: 1,
    intervalCap: 1,
    interval: 1000
  })
  await queue.addAll(spreadsheetsPromises)
}

const spreadsheetToJsonFiles = async ({ id, name, tables, prefixFileName }) => {
  console.log(`Spreadheet: ${name}`)

  try {
    // construit la liste avec un fichier par table
    const filesList = filesListBuild({ name, tables, prefixFileName })

    // récupère un tableau avec une entrée { range, majorDimension, values }
    const res = await spreadsheetsGet(
      credentials,
      id,
      filesList.map(({ worksheetName }) => worksheetName)
    )

    // converti la réponse en json
    // la première ligne de value forme les clés
    const jsons = res.map(r => rowsToJson(r.values.shift(), r.values))

    filesList.forEach(({ path, cb }, i) => {
      // applique le callback si il existe
      const json = cb ? cb(jsons[i], path) : jsons[i]

      fileCreate(path, JSON.stringify(json, null, 2))
    })
  } catch (error) {
    errorLog(error)
  }
}

// retourne un tableau par spreadsheet
// une promesse par onglet de la spreadsheet
const filesListBuild = ({ name, tables, prefixFileName }) =>
  tables.reduce(
    (acc, table) => [
      ...acc,
      {
        path: filePathCreate(
          prefixFileName ? `${name}-${table.name}` : table.name
        ),
        worksheetName: table.name,
        cb: table.cb
      }
    ],
    []
  )

const rowsToJson = (columns, rows) =>
  rows.map(row =>
    columns.reduce((acc, column, index) => {
      if (row[index]) {
        acc[column] = row[index]
      }
      return acc
    }, {})
  )

const filePathCreate = fileName =>
  `./sources/${fileName.replace(/_/g, '-')}.json`

run()
