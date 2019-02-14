import jsonToSpreadsheet from './json-to-spreadsheet'
import credentials from '../credentials'

const dbProcess = async definition => {
  const elements = await definition.fetch

  await jsonToSpreadsheet(
    definition.spreadsheetId,
    credentials,
    definition.tables,
    elements
  )
  return `Export: ${elements.length} ${definition.name}`
}

export default dbProcess
