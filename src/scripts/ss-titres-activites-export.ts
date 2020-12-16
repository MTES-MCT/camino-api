import 'dotenv/config'
import '../init'
import dbToSpreadsheet from '../tools/ss-export/db-to-spreadsheet'
import definition from '../tools/ss-export/definitions/titres-activites'

const ssTitresActivitesExport = async () => {
  await dbToSpreadsheet(definition)
}

ssTitresActivitesExport()
  .then(() => {
    process.exit()
  })
  .catch(() => {
    process.exit(1)
  })
