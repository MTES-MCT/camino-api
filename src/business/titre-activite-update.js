import { titreActiviteGet } from '../database/queries/titres-activites'
import { titreGet } from '../database/queries/titres'
import titresPropsActivitesUpdate from './processes/titres-props-activites-update'
import { titreActivitesRowUpdate } from '../tools/export/titre-activites'

const titreActiviteUpdate = async titreActiviteId => {
  const activite = await titreActiviteGet(titreActiviteId)
  const titre = await titreGet(activite.titreId)

  const titresPropsActivitesUpdated = await titresPropsActivitesUpdate([titre])

  console.log(
    `mise à jour: ${titresPropsActivitesUpdated.length} titre(s) (propriétés-activités)`
  )

  // export des activités vers la spreadsheet camino-db-titres-activites-prod
  console.log('export des activités ')
  await titreActivitesRowUpdate(activite)
}

export default titreActiviteUpdate
