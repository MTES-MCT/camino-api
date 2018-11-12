const jsonToSpreadsheet = require('./json-to-spreadsheet')
const credentials = require('../credentials')

const dbProcess = async definition => {
  const content = await definition.fetch
  await jsonToSpreadsheet(
    definition.spreadsheetId,
    credentials,
    definition.tables,
    content
  )
}

module.exports = dbProcess
