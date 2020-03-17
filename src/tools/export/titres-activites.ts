import 'dotenv/config'
import '../../database/index'
import dbToSpreadsheet from './_utils/db-to-spreadsheets'
import spreadsheet from './spreadsheets/titres-activites'

const run = async () => {
  await dbToSpreadsheet(spreadsheet)

  process.exit()
}

run()
