import { ICredentials } from './types'

export default {
  private_key: process.env.GOOGLE_EXPORT_PRIVATE_KEY,
  client_email: process.env.GOOGLE_EXPORT_CLIENT_EMAIL,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
} as ICredentials
