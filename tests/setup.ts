import 'dotenv/config'

import { dbManager } from './db-manager'
import { mailjet } from '../src/tools/api-mailjet'

export default async () => {
  // https://github.com/mailjet/mailjet-apiv3-nodejs#disable-api-call
  mailjet.post('send', { version: 'v3.1', perform_api_call: false })
  await dbManager.init()
}
