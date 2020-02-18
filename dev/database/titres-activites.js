import 'dotenv/config'
import '../../src/database/index'

import { titresGet } from '../../src/database/queries/titres'

import titresActivitesTypesUpdate from '../../src/business/processes/titres-activites-update'
import { activitesTypesGet } from '../../src/database/queries/metas'

async function main() {
  const titres = await titresGet()
  const activitesTypes = await activitesTypesGet()
  const titresActivitesUpdated = await titresActivitesTypesUpdate(
    titres,
    activitesTypes
  )

  console.log(titresActivitesUpdated)

  process.exit(0)
}

main()
