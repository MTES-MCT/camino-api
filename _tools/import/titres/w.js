const titresSpreadsheetToJson = require('./_titresSpreadsheetToJson');
const spreadsheetId = '19_7XO6gUpX_vgdot1HMmwWgk7ucsqQHQEMIn09JSXuM';
const type = 'w';

module.exports = () => {
  titresSpreadsheetToJson(spreadsheetId, type);
};
