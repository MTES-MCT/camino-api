import { job } from 'cron'
import daily from './business/daily'
import documentsCheck from './tools/documents/check'

const tasks = async () => {
  await daily()
  await documentsCheck()
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
