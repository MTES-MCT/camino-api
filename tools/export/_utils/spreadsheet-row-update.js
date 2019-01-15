const GoogleSpreadsheet = require('google-spreadsheet')
const rowFormat = require('./row-format')

const {
  gssUseServiceAccountAuth,
  rowsGet,
  rowDelete,
  rowAdd
} = require('./google-spreadsheet-promisify')

const spreadsheetRowUpdate = async (
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

  const rows = await rowsGet(gss, 1, { query: `(id=${content.id})` })

  if (rows[0]) {
    await rowDelete(rows[0])
  }

  await rowAdd(gss, 1, row)
}

module.exports = spreadsheetRowUpdate
