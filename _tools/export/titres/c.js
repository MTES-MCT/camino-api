const titresDbToSpreadsheet = require('./_titres-db-to-spreadsheet.js')
// const spreadsheetId = '1cEtCM5nj9ABOfvWabHGSAaMROv2JuF6kLZ4aI3a7Y1s'

const spreadsheetId = '1uuYKdG-66IeHmlpvG2FWJRIUVl1qg2GsMaACul5Lf20'
const type = 'c'

module.exports = async () => titresDbToSpreadsheet(spreadsheetId, type)
