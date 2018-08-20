const titresSpreadsheetToJson = require('./_titres-spreadsheet-to-json')
const spreadsheetId = '19_7XO6gUpX_vgdot1HMmwWgk7ucsqQHQEMIn09JSXuM'
const type = 'w'

module.exports = async () => titresSpreadsheetToJson(spreadsheetId, type)
