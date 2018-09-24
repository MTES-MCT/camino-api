const titresDbToSpreadsheet = require('./_titres-db-to-spreadsheet.js')
// const spreadsheetId = '10Vl3yqq4Acl00KSyudBYP5qSRZwPbRhDsUhBopxhn7o'
const spreadsheetId = '1vzSK7f433-jjvaHxCJ0hf7368JB0fA4WY-An27c9uY4'
const type = 'f'

module.exports = async () => titresDbToSpreadsheet(spreadsheetId, type)
