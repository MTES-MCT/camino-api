const spreadsheetToJson = require('./_utils/_spreadsheet-to-json')
const spreadsheetId = '1-79DUlhFr608AJab-EouZUTk3NlWUstt6BY1mHZ3ub8'
const filePathCreate = require('./_utils/file-path-create')

const cb = json =>
  json.map(j =>
    Object.keys(j).reduce((res, cur) => {
      res[cur] = cur === 'alias' ? j[cur].split(' ; ') : j[cur]
      return res
    }, {})
  )

module.exports = async () =>
  Promise.all([
    spreadsheetToJson(
      filePathCreate('substances'),
      spreadsheetId,
      'substances',
      cb
    ),
    spreadsheetToJson(
      filePathCreate('substances_legals'),
      spreadsheetId,
      'substances_legals'
    ),
    spreadsheetToJson(
      filePathCreate('substances_legals_codes'),
      spreadsheetId,
      'substances_legals_codes'
    )
  ])
