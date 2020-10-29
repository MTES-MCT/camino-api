import 'dotenv/config'
import '../../src/init'

import * as fs from 'fs'

import { titreCreate } from '../../src/database/queries/titres'

const main = async () => {
  const titres = JSON.parse(
    fs.readFileSync('./dev/database/rntm-titres.json').toString()
  )

  let nb = 0
  for (const titre of titres) {
    await titreCreate(titre, {}, 'super')
    nb++
  }

  console.log('Titres importés', nb)
  process.exit(0)
}

main().catch(e => {
  console.error(e)

  process.exit(1)
})
