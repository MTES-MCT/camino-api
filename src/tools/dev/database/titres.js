import 'dotenv/config'
import '../../database/index'

import { titresGet } from '../../../database/queries/titres-demarches'

async function main() {
  const res = await titresGet({
    typeIds: [
      'apx',
      'arc',
      'arg',
      'axm',
      'cxx',
      'prh',
      'prx',
      'pxc',
      'pxg',
      'pxh',
      'pxm'
    ],
    domaineIds: ['c', 'g', 'h', 'm', 'w'],
    statutIds: ['dmi', 'mod', 'val'],
    substances: null,
    noms: null,
    entreprises: null,
    references: null
  })

  console.log(res)

  process.exit()
}

main()
