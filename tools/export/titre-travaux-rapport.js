const credentials = require('./credentials')
const rowToSpreadsheetAdd = require('./_utils/row-to-spreadsheet-add')
const tables = require('./tables/titres-travaux')

const titreTravauxRapportRowAdd = async content => {
  const spreadsheetId =
    process.env.GOOGLE_SPREADSHEET_ID_EXPORT_TITRES_TRAVAUX_RAPPORTS

  await rowToSpreadsheetAdd(spreadsheetId, credentials, tables[0], content)
}

module.exports = { titreTravauxRapportRowAdd }
