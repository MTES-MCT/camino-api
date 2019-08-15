import 'dotenv/config'
import '../../../database/index'
import fileCreate from '../../file-create'

import { titresGet } from '../../../database/queries/titres'

import titresPointsReferencesCreate from '../../../business/processes/titres-points-references-create'

const run = async () => {
  const titres = await titresGet()
  const res = await titresPointsReferencesCreate(titres)
  // console.log(
  //   res[0].demarches[0].etapes.map(e => e.points.map(point => point.references))
  // )
  await fileCreate('titres.json', JSON.stringify(res, null, 2))
  console.log('Done')

  process.exit()
}

run()
