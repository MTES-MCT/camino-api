import 'dotenv/config'
import '../../../database/index'

import { titresGet } from '../../../database/queries/titres'

import titresActivitesTypesUpdate from '../../../tasks/processes/titres-activites-update'
import { activitesTypesGet } from '../../../database/queries/metas'

async function main() {
  const titres = await titresGet()
  const activitesTypes = await activitesTypesGet()
  const titresActivitesUpdated = await titresActivitesTypesUpdate(
    titres,
    activitesTypes,
    [2018]
  )

  console.log(titresActivitesUpdated)

  process.exit(0)
}

main()
