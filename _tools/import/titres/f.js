const titresSpreadsheetToJson = require('./_titres-spreadsheet-to-json.js');
const spreadsheetId = '10Vl3yqq4Acl00KSyudBYP5qSRZwPbRhDsUhBopxhn7o';
const type = 'f';

module.exports = () => {
  titresSpreadsheetToJson(spreadsheetId, type);
};
