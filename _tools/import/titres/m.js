const titresSpreadsheetToJson = require('./_titres-spreadsheet-to-json.js');
const spreadsheetId = '1wm64Ot7QAAslHOlXYSTtws6NKOMdKsN575615QCHQiA';
const type = 'm';

module.exports = () => {
  titresSpreadsheetToJson(spreadsheetId, type);
};
