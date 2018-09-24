const titresDbToSpreadsheet = require('./_titres-db-to-spreadsheet.js')
// const spreadsheetId = '1zIwhE7UkCMtfo3zqDpU09swk2kmKrzslg8r4oQmAbz4'
const spreadsheetId = '1oNJJiPtzfQ6LFn6Tqm-Z5qDJqWLOCaU9-iXLn7NDq0o'
const type = 'g'

module.exports = async () => titresDbToSpreadsheet(spreadsheetId, type)
