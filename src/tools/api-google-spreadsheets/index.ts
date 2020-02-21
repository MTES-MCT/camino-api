/* eslint camelcase: 0 */

import { google, sheets_v4 } from 'googleapis'
const googleSheets = google.sheets('v4')

const authGet = ({ client_email, private_key, scopes }: ICredentials) =>
  new google.auth.JWT(client_email, undefined, private_key, scopes)

interface ICredentials {
  private_key: string
  client_email: string
  scopes: string[]
}

const spreadsheetsGet = async (
  cred: ICredentials,
  spreadsheetId: string,
  ranges: string[]
) => {
  const res = await googleSheets.spreadsheets.values.batchGet({
    auth: authGet(cred),
    spreadsheetId,
    ranges
  })

  return res.data?.valueRanges
}

const spreadsheetGet = async (cred: ICredentials, spreadsheetId: string) => {
  const res = await googleSheets.spreadsheets.get({
    auth: authGet(cred),
    spreadsheetId
  })

  return res.data
}

const spreadsheetBatchUpdate = async (
  cred: ICredentials,
  spreadsheetId: string,
  requests: sheets_v4.Schema$Request[]
) => {
  const res = await googleSheets.spreadsheets.batchUpdate({
    auth: authGet(cred),
    spreadsheetId,
    requestBody: { requests }
  })

  return res.data
}

const spreadsheetValuesGet = async (
  cred: ICredentials,
  spreadsheetId: string,
  range: string
) => {
  const res = await googleSheets.spreadsheets.values.get({
    auth: authGet(cred),
    spreadsheetId,
    range
  })

  return res.data
}

export {
  spreadsheetGet,
  spreadsheetsGet,
  spreadsheetBatchUpdate,
  spreadsheetValuesGet
}
