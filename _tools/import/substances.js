const spreadsheetToJson = require('./_spreadsheet-to-json');
const spreadsheetId = '1-79DUlhFr608AJab-EouZUTk3NlWUstt6BY1mHZ3ub8';

const cb = json =>
  json.map(j =>
    Object.keys(j).reduce((res, cur) => {
      res[cur] = cur === 'alias' ? j[cur].split(' ; ') : j[cur];
      return res;
    }, {})
  );

module.exports = () => {
  spreadsheetToJson(spreadsheetId, 'substances', 'substances', cb);
  spreadsheetToJson(spreadsheetId, 'substances_legals', 'substances_legals');
  spreadsheetToJson(
    spreadsheetId,
    'substances_legals_codes',
    'substances_legals_codes'
  );
};
