import 'dotenv/config'
import './init'
import { job } from 'cron'
import daily from './business/daily'
import documentsCheck from './tools/documents/check'
import arbresDemarchesCheck from './tools/arbres-demarches/check'
import './config/logger-cron'
import { emailSend } from './tools/emails-send'
import { readFileSync, unlinkSync } from 'fs'

const tasks = async () => {
  console.info('Cron quotidien : démarrage')
  await daily()
  await documentsCheck()
  await arbresDemarchesCheck()

  const emailBody = readFileSync('cron.log').toString()
  await emailSend(process.env.ADMIN_EMAIL!, 'Résultats du daily', emailBody)
  unlinkSync('cron.log')
  console.info('Cron quotidien : terminé')
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
