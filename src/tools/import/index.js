import 'dotenv/config'
import * as PQueue from 'p-queue'
import spreadsheetToJson from './_utils/_spreadsheet-to-json'
import filePathCreate from './_utils/file-path-create'
import fileCreate from './_utils/file-create.js'

import spreadsheets from './spreadsheets'

const run = async () => {
  // on utilise une queue plutôt que Promise.all
  // pour ne pas surcharger l'API de google
  const spreadSheetsPromises = spreadsheets.map(s => () =>
    spreadsheetsProcess(s)
  )
  const spreadSheetsQueue = new PQueue({ concurrency: 1 })
  await spreadSheetsQueue.addAll(spreadSheetsPromises)
}

const spreadsheetsProcess = async spreadsheet =>
  Promise.all([
    ...spreadsheet.tables.map(table =>
      spreadsheet.id
        ? // si l'id de la spreadsheet est renseignée
          spreadsheetToJson(
            filePathCreate(
              spreadsheet.prefixFileName
                ? `${spreadsheet.name}-${table.name}`
                : table.name
            ),
            spreadsheet.id,
            table.name,
            table.cb
          )
        : // si l'id est absente on créé un fichier vide
          fileCreate(
            filePathCreate(
              spreadsheet.prefixFileName
                ? `${spreadsheet.name}-${table.name}`
                : table.name
            ),
            JSON.stringify([], null, 2)
          )
    )
  ])

run()
