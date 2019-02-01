import jsonToSpreadsheet from './json-to-spreadsheet'
import credentials from '../credentials'

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

export default dbProcess
