const titresDbToSpreadsheet = require('./_titres-db-to-spreadsheet.js')
// const spreadsheetId = '1dfzKTiUO3xAPm7IsI-Ud5PcVZDvTxFODSzoePu_aFQg'
const spreadsheetId = '1lWIerFGIqA51hBcDN1mN4ytd2J3MXRpUeD9AdROzBZY'
const type = 'r'

module.exports = async () => titresDbToSpreadsheet(spreadsheetId, type)
