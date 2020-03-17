import { ICredentials } from '../export/types'

export default {
  private_key: process.env.GOOGLE_PRIVATE_KEY,
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
} as ICredentials
