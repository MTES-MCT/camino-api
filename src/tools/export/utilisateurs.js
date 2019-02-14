import 'dotenv/config'
import '../../database/index'
import dbProcess from './_utils/db-process'
import spreadsheets from './spreadsheets'

const utilisateursSpreadsheet = spreadsheets.find(
  spreadsheet => spreadsheet.name === 'utilisateurs'
)

const run = async () => {
  const res = await dbProcess(utilisateursSpreadsheet)
  console.log(res)
  process.exit()
}

run()
