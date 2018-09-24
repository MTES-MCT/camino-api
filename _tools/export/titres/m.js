const titresDbToSpreadsheet = require('./_titres-db-to-spreadsheet.js')
// const spreadsheetId = '1wm64Ot7QAAslHOlXYSTtws6NKOMdKsN575615QCHQiA'
const spreadsheetId = '12rhnrvKOx3s38BLptpMSx9PCulHFZF2OpZqxUPqWR88'
const type = 'm'

module.exports = async () => titresDbToSpreadsheet(spreadsheetId, type)
