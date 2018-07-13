const spreadSheetToJson = require('google-spreadsheet-to-json')
const credentials = require('./credentials.js')
const fileCreate = require('./_utils/file-create')
const path = require('path')

module.exports = (spreadsheetId, fileName, worksheet, cb) => {
  spreadSheetToJson({
    spreadsheetId,
    credentials,
    worksheet
  })
    .then(json => {
      if (cb) {
        json = cb(json)
      }
      const fileContent = JSON.stringify(json, null, 2)
      const filePath = path.join(
        __dirname,
        `../sources/${fileName.replace(/_/g, '-')}.json`
      )

      fileCreate(filePath, fileContent)
    })
    .catch(err => {
      console.log(err.message)
      console.log(err.stack)
    })
}
