import 'dotenv/config'
import '../../init'
import dbToSpreadsheet from './_utils/db-to-spreadsheets'
import spreadsheet from './spreadsheets/titres-activites'

const run = async () => {
  await dbToSpreadsheet(spreadsheet)

  process.exit()
}

run()
