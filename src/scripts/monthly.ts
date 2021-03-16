import '../init'
import monthly from '../business/monthly'

monthly()
  .then(() => {
    process.exit()
  })
  .catch(() => {
    process.exit(1)
  })
