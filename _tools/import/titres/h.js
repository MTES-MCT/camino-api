const titresSpreadsheetToJson = require('./_titresSpreadsheetToJson.js');
const spreadsheetId = '1Jn-iWWY12MSY2ypFILIBtqgZGS4gAECyHbkUxxH_O0Y';
const type = 'h';

module.exports = () => {
  titresSpreadsheetToJson(spreadsheetId, type);
};
