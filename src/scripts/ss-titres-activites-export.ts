import 'dotenv/config'
import '../init'
import dbToSpreadsheet from '../tools/ss-export/db-to-spreadsheets'
import spreadsheet from '../tools/ss-export/spreadsheets/titres-activites'

const ssTitresActivitesExport = async () => {
  await dbToSpreadsheet(spreadsheet)

  process.exit()
}

ssTitresActivitesExport()
