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
  return `Export: ${content.length} ${definition.name}`
}

module.exports = dbProcess
