const titresSpreadsheetToJson = require('./_titresSpreadsheetToJson.js');
const spreadsheetId = '10Vl3yqq4Acl00KSyudBYP5qSRZwPbRhDsUhBopxhn7o';
const type = 'f';

module.exports = () => {
  titresSpreadsheetToJson(spreadsheetId, type);
};
