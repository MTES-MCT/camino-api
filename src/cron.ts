import 'dotenv/config'
import './init'
import { job } from 'cron'
import daily from './business/daily'
import documentsCheck from './tools/documents/check'
import './config/logger-cron'
import { emailSend } from './tools/emails-send'
import { readFileSync, unlinkSync } from 'fs'

const tasks = async () => {
  await daily()
  await documentsCheck()

  const emailBody = readFileSync('cron.log').toString()
  await emailSend(process.env.ADMIN_EMAIL!, 'Résultats du daily', emailBody)
  unlinkSync('cron.log')
}

job(
  // cronTime
  '00 00 04 * * 1-5',
  // onTick
  tasks,
  //  onComplete
  null,
  // start
  true,
  // timezone
  'Europe/Paris',
  // context
  null,
  // runOnInit
  false
  // utcOffset
  // unrefTimeout
)
