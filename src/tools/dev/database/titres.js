import 'dotenv/config'
import '../../../database/index'

import { titreGet } from '../../../database/queries/titres'

async function main() {
  const res = titreGet('g-prx-arzacq-2014')

  console.log('one', res)

  setTimeout(() => {
    console.log('two', res)

    process.exit()
  }, 1000)
}

main()
