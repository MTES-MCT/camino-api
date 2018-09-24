const titresDbToSpreadsheet = require('./_titres-db-to-spreadsheet.js')
// const spreadsheetId = '1uuPdp6wBQMJFv7oBbeBDQDzCPhuyxYgZcqG_uTD_SSA'
const spreadsheetId = '1y5dcN6iIj32Q3q69SeKHi5vBYTr_HwEYUItFjWE0UTY'
const type = 's'

module.exports = async () => titresDbToSpreadsheet(spreadsheetId, type)
