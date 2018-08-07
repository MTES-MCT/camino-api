const titresSpreadsheetToJson = require('./_titres-spreadsheet-to-json.js');
const spreadsheetId = '1w--hbXC00TT6AkRJOR7Q9WMsuZt1Y1G1d7GC8rsKr6E';
const type = 'm973';

module.exports = () => {
  titresSpreadsheetToJson(spreadsheetId, type);
};
