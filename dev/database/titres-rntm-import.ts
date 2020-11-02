import 'dotenv/config'
import '../../src/init'

import { titreCreate } from '../../src/database/queries/titres'

const titres = require('./rntm-titres.json')

const main = async () => {
  console.time('GO')

  let nb = 0
  for (const titre of titres) {
    await titreCreate(titre, {}, 'super')
    nb++
  }

  console.log('Titres importés', nb)
  console.timeEnd('GO')

  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
