import { google } from 'googleapis'
const googleSheets = google.sheets('v4')

const spreadsheetsGet = async (credentials, spreadsheetId, worksheetNames) =>
  new Promise((resolve, reject) =>
    googleSheets.spreadsheets.values.batchGet(
      {
        auth: authGet(credentials),
        spreadsheetId,
        ranges: worksheetNames
      },
      (err, res) => {
        if (err) {
          return reject(err)
        }

        resolve(res.data.valueRanges)
      }
    )
  )

const spreadsheetGet = async (credentials, spreadsheetId) =>
  new Promise((resolve, reject) =>
    googleSheets.spreadsheets.get(
      { spreadsheetId, auth: authGet(credentials) },
      (err, res) => {
        if (err) {
          return reject(err)
        }

        resolve(res.data)
      }
    )
  )

const worksheetAdd = async (credentials, spreadsheetId, worksheet) =>
  new Promise((resolve, reject) =>
    googleSheets.spreadsheets.batchUpdate(
      {
        auth: authGet(credentials),
        spreadsheetId,
        resource: {
          requests: [{ addSheet: worksheet }]
        }
      },
      (err, res) => {
        if (err) {
          return reject(err)
        }

        resolve(res.data)
      }
    )
  )

const worksheetDelete = async (credentials, spreadsheetId, worksheetId) =>
  new Promise((resolve, reject) =>
    googleSheets.spreadsheets.batchUpdate(
      {
        auth: authGet(credentials),
        spreadsheetId,
        resource: {
          requests: [
            {
              deleteSheet: { sheetId: worksheetId }
            }
          ]
        }
      },
      (err, res) => {
        if (err) {
          return reject(err)
        }

        resolve(res.data)
      }
    )
  )

const authGet = credentials =>
  new google.auth.JWT(credentials.client_email, null, credentials.private_key, [
    'https://www.googleapis.com/auth/spreadsheets'
  ])

export { spreadsheetsGet, spreadsheetGet, worksheetAdd, worksheetDelete }
