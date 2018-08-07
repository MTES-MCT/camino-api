const titresSpreadsheetToJson = require('./_titres-spreadsheet-to-json.js');
const spreadsheetId = '1uuPdp6wBQMJFv7oBbeBDQDzCPhuyxYgZcqG_uTD_SSA';
const type = 's';

module.exports = () => {
  titresSpreadsheetToJson(spreadsheetId, type);
};
