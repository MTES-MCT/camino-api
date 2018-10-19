const titresSpreadsheetToJson = require('./_titres-spreadsheet-to-json.js')
const spreadsheetId = '139RkaNx2NxsDpO5zH4aLbQh3ex3dP6nPqSs96uxRUcU'
const type = 'm973'

module.exports = async () => titresSpreadsheetToJson(spreadsheetId, type)
