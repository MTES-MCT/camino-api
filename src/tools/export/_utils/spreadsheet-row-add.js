import * as GoogleSpreadsheet from 'google-spreadsheet'
import rowFormat from './row-format'

import {
  gssUseServiceAccountAuth,
  rowAdd
} from './google-spreadsheet-promisify'

const spreadsheetRowAdd = async (
  spreadsheetId,
  credentials,
  table,
  content
) => {
  // instancie le constructeur
  const gss = new GoogleSpreadsheet(spreadsheetId)

  // authentification dans google
  await gssUseServiceAccountAuth(gss, credentials)

  const row = rowFormat(content, table.columns, table.callbacks)

  await rowAdd(gss, 1, row)
}

export default spreadsheetRowAdd
