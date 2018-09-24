const titresDbToSpreadsheet = require('./_titres-db-to-spreadsheet.js')
// const spreadsheetId = '19_7XO6gUpX_vgdot1HMmwWgk7ucsqQHQEMIn09JSXuM'
const spreadsheetId = '1Xq_Tnv51KKujhcB0qtbd0lEvJQzZ8nbOgmOk7sLaGjQ'
const type = 'w'

module.exports = async () => titresDbToSpreadsheet(spreadsheetId, type)
