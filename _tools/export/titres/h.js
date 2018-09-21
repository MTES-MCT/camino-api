const titresDbToSpreadsheet = require('./_titres-db-to-spreadsheet.js')
// const spreadsheetId = '1Jn-iWWY12MSY2ypFILIBtqgZGS4gAECyHbkUxxH_O0Y'

// test id
const spreadsheetId = '1I_NJC4xXZWHmhiy4S7rgTvhYlFvHsiHYai-9jvPhmf4'
const type = 'h'

module.exports = async () => titresDbToSpreadsheet(spreadsheetId, type)
