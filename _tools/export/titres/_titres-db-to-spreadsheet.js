const jsonToSpreadsheet = require('../_utils/json-to-spreadsheet')

const { titresGet } = require('../../../postgres/queries/titres')

const credentials = require('../credentials')

const tables = require('./_tables')

module.exports = async (spreadsheetId, domaineId) => {
  const titres = await titresGet({
    typeIds: undefined,
    domaineIds: [domaineId],
    statutIds: undefined,
    substances: undefined,
    noms: undefined
  })

  await jsonToSpreadsheet(spreadsheetId, credentials, tables, titres)
}
