import 'dotenv/config'
import '../../init'
import ssExport from '../tools/ss-export'

ssExport().then(() => {
  process.exit()
})
