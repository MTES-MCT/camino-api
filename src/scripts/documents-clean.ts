import '../init'
import { documentsClean } from '../tools/documents/clean'

documentsClean()
  .then(() => {
    process.exit()
  })
  .catch(e => {
    console.log(e)
    process.exit(1)
  })
