const titresSpreadsheetToJson = require('./_titres-spreadsheet-to-json')
const spreadsheetId = '1-jwwDe7UZfiluHEDB57sTo8ANoj4J3W9oH81B-Hb17c'
const type = 'g'

module.exports = async () => titresSpreadsheetToJson(spreadsheetId, type)
