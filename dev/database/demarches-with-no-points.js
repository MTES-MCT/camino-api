import 'dotenv/config'
import '../../src/database/index'

import { titresDemarchesGet } from '../../src/database/queries/titres-demarches'

async function main() {
  let res = await titresDemarchesGet({ typeIds: ['abr', 'ren', 'ret'] })

  res = res.filter(({ typeId, etapes }) => {
    if (typeId === 'ren') {
      return !etapes.find(te => te.points.length)
    }

    return true
  })

  console.log(res.map(({ id, statutId }) => ({ id, statutId })))

  process.exit()
}

main()
