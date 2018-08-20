const titresSpreadsheetToJson = require('./_titres-spreadsheet-to-json')
const spreadsheetId = '1dfzKTiUO3xAPm7IsI-Ud5PcVZDvTxFODSzoePu_aFQg'
const type = 'a'

module.exports = async () => titresSpreadsheetToJson(spreadsheetId, type)
