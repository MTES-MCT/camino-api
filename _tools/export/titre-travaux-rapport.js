const PQueue = require('p-queue')
const GoogleSpreadsheet = require('google-spreadsheet')
const decamelize = require('decamelize')

const {
  gssUseServiceAccountAuth,
  rowAdd
} = require('./google-spreadsheet-promisify')

const rowToSpreadsheetAdd = async (
  spreadsheetId,
  credentials,
  tables,
  content
) => {
  // instancie le constructeur
  const gss = new GoogleSpreadsheet(spreadsheetId)

  // authentification dans google
  await gssUseServiceAccountAuth(gss, credentials)
}
