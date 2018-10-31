const titresSpreadsheetToJson = require('./_titres-spreadsheet-to-json.js')
const spreadsheetId = '1QcsOS9_8ghqbFc13jOyxxxex4IRmiSjw0qtKYMXJxe4'
const type = 'm973'

module.exports = async () => titresSpreadsheetToJson(spreadsheetId, type)
