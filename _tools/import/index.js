require('dotenv').config()
const spreadsheetToJson = require('./_utils/_spreadsheet-to-json')
const filePathCreate = require('./_utils/file-path-create')
const PQueue = require('p-queue')
const spreadsheets = require('./spreadsheets')

const run = async () => {
  // on utilise une queue plutôt que Promise.all
  // pour ne pas surcharger l'API de google
  const spreadSheetsPromises = spreadsheets
    .filter(s => s.id)
    .map(s => () => spreadsheetsProcess(s))
  const spreadSheetsQueue = new PQueue({ concurrency: 1 })
  await spreadSheetsQueue.addAll(spreadSheetsPromises)
}

const spreadsheetsProcess = async spreadsheet =>
  Promise.all([
    ...spreadsheet.tables.map(table =>
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
    )
  ])

run()
