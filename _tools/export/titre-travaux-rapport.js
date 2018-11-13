const credentials = require('./credentials')
const rowToSpreadsheetAdd = require('./_utils/row-to-spreadsheet-add')
const table = require('./tables/titres-travaux')

const t = async content => {
  const spreadsheetId =
    process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_TRAVAUX_RAPPORTS

  await rowToSpreadsheetAdd(spreadsheetId, credentials, table, content)
}

module.exports = t
