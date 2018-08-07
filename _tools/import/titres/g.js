const titresSpreadsheetToJson = require('./_titres-spreadsheet-to-json');
const spreadsheetId = '1zIwhE7UkCMtfo3zqDpU09swk2kmKrzslg8r4oQmAbz4';
const type = 'g';

module.exports = () => {
  titresSpreadsheetToJson(spreadsheetId, type);
};
