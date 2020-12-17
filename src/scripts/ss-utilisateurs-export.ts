import 'dotenv/config'
import '../init'
import dbToSpreadsheet from '../tools/ss-export/db-to-spreadsheet'
import definition from '../tools/ss-export/definitions/utilisateurs'
import { IUtilisateur } from '../types'

const ssUtilisateursExport = async () => {
  await dbToSpreadsheet<IUtilisateur>(definition)
}

ssUtilisateursExport()
  .then(() => {
    process.exit()
  })
  .catch(() => {
    process.exit(1)
  })
