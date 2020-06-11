import 'dotenv/config'
import '../../init'
import dbToSpreadsheets from './_utils/db-to-spreadsheets'
import spreadsheet from './spreadsheets/utilisateurs'
import { IUtilisateur } from '../../types'

const run = async () => {
  await dbToSpreadsheets<IUtilisateur>(spreadsheet)

  process.exit()
}

run()
