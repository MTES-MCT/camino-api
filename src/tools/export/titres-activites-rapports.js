import 'dotenv/config'
import '../../database/index'
import dbProcess from './_utils/db-process'
import spreadsheets from './spreadsheets'

const titresActivitesRapportsSpreadsheet = spreadsheets.find(
  spreadsheet => spreadsheet.name === 'titres-activites-rapports'
)

const run = async () => {
  const res = await dbProcess(titresActivitesRapportsSpreadsheet)
  console.log(res)
  process.exit()
}

run()
