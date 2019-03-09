import { google } from 'googleapis'
const googleSheets = google.sheets('v4')

const spreadsheetsGet = async (cred, spreadsheetId, ranges) =>
  new Promise((resolve, reject) =>
    googleSheets.spreadsheets.values.batchGet(
      { auth: authGet(cred), spreadsheetId, ranges },
      (err, res) => (err ? reject(err) : resolve(res.data.valueRanges))
    )
  )

const spreadsheetGet = async (cred, spreadsheetId) =>
  new Promise((resolve, reject) =>
    googleSheets.spreadsheets.get(
      { auth: authGet(cred), spreadsheetId },
      (err, res) => (err ? reject(err) : resolve(res.data))
    )
  )

const spreadsheetBatchUpdate = async (cred, spreadsheetId, requests) =>
  new Promise((resolve, reject) =>
    googleSheets.spreadsheets.batchUpdate(
      {
        auth: authGet(cred),
        spreadsheetId,
        resource: {
          requests
        }
      },
      (err, res) => (err ? reject(err) : resolve(res.data))
    )
  )

const spreadsheetValuesGet = async (cred, spreadsheetId, range) =>
  new Promise((resolve, reject) =>
    googleSheets.spreadsheets.values.get(
      {
        auth: authGet(cred),
        spreadsheetId,
        range
      },
      (err, res) => (err ? reject(err) : resolve(res.data))
    )
  )

// eslint-disable-next-line camelcase
const authGet = ({ client_email, private_key, scopes }) =>
  new google.auth.JWT(client_email, null, private_key, scopes)

export {
  spreadsheetGet,
  spreadsheetsGet,
  spreadsheetBatchUpdate,
  spreadsheetValuesGet
}
