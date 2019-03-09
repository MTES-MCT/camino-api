import 'dotenv/config'
import '../../database/index'
import dbToSpreadsheets from './_utils/db-to-spreadsheets'
import spreadsheet from './spreadsheets/utilisateurs'

const run = async () => {
  await dbToSpreadsheets(spreadsheet)

  process.exit()
}

run()
