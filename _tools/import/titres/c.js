const titresSpreadsheetToJson = require('./_titresSpreadsheetToJson');
const spreadsheetId = '1cEtCM5nj9ABOfvWabHGSAaMROv2JuF6kLZ4aI3a7Y1s';
const type = 'c';

module.exports = () => {
  titresSpreadsheetToJson(spreadsheetId, type);
};
