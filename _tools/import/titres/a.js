const titresSpreadsheetToJson = require('./_titresSpreadsheetToJson');
const spreadsheetId = '1dfzKTiUO3xAPm7IsI-Ud5PcVZDvTxFODSzoePu_aFQg';
const type = 'a';

module.exports = () => {
  titresSpreadsheetToJson(spreadsheetId, type);
};
