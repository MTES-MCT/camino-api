const titresSpreadsheetToJson = require('./_titres-spreadsheet-to-json.js')
const spreadsheetId = '1Jn-iWWY12MSY2ypFILIBtqgZGS4gAECyHbkUxxH_O0Y'
const type = 'h'

module.exports = async () => titresSpreadsheetToJson(spreadsheetId, type)
