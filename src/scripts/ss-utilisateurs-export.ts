import 'dotenv/config'
import '../init'
import dbToSpreadsheets from '../tools/ss-export/db-to-spreadsheets'
import spreadsheet from '../tools/ss-export/spreadsheets/utilisateurs'
import { IUtilisateur } from '../types'

const ssUtilisateursExport = async () => {
  await dbToSpreadsheets<IUtilisateur>(spreadsheet)
}

ssUtilisateursExport()
  .then(() => {
    process.exit()
  })
  .catch(() => {
    process.exit(1)
  })
