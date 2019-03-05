import 'dotenv/config'
import '../../database/index'
import dbProcess from './_utils/db-process'
import spreadsheets from './spreadsheets'

const titresActivitesSpreadsheet = spreadsheets.find(
  spreadsheet => spreadsheet.name === 'titres-activites'
)

const run = async () => {
  const res = await dbProcess(titresActivitesSpreadsheet)
  console.log(res)
  process.exit()
}

run()
