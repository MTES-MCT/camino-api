import 'dotenv/config'
import '../../database/index'
import dbProcess from './_utils/db-process'
import spreadsheets from './spreadsheets'

const titresTravauxRapportsSpreadsheet = spreadsheets.find(
  spreadsheet => spreadsheet.name === 'titres-travaux-rapports'
)

const run = async () => {
  const res = await dbProcess(titresTravauxRapportsSpreadsheet)
  console.log(res)
  process.exit()
}

run()
