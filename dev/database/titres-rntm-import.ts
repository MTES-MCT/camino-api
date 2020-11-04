import 'dotenv/config'
import '../../src/init'

import Titres from '../../src/database/models/titres'
import options from '../../src/database/queries/_options'

const titres = require('../../sources/rntm-titres.json')

const main = async () => {
  console.time('GO')

  let nb = 0
  for (const titre of titres) {
    await Titres.query().insertGraph(titre, options.titres.update)
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
