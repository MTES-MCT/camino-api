import 'dotenv/config'
import 'dotenv/config'
import '../../database/index'
import fileCreate from '../file-create'

import { inseeSirenGet, inseeSiretGet } from '../api-insee'

const siren1 = '572199164'
const siren2 = '484860507'

const siret1 = '57219916400045'
const siret2 = '48486050700017'

const entreprises = ['c', 'f', 'g', 'h', 'm', 'r', 's', 'w']
  .reduce(
    (r, d) => r.concat(require(`../../../sources/entreprises-titres-${d}`)),
    []
  )
  .filter(e => e.legal_siren)
  .map(e => e.legal_siren)
  .slice(0, 19)

console.log(entreprises.length)

async function main() {
  if (true) {
    const result = await inseeSirenGet(entreprises)

    console.log(result.length)

    await fileCreate('test-entreprises.json', JSON.stringify(result, null, 2))
  }

  if (false) {
    const etablissements = await inseeSiretGet([siret1, siret2])

    console.log(etablissements)

    await fileCreate(
      'test-etablissements.json',
      JSON.stringify(etablissements, null, 2)
    )
  }

  process.exit()
}

main()
