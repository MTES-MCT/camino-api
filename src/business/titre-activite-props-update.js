import { titreGet } from '../database/queries/titres'
import titresPropsActivitesUpdate from './processes/titres-props-activites-update'

const titreActivitePropUpdate = async titreId => {
  const titre = await titreGet(titreId)

  const titresPropsActivitesUpdated = await titresPropsActivitesUpdate([titre])

  console.log(
    `mise à jour: ${titresPropsActivitesUpdated.length} titre(s) (propriétés-activités)`
  )
}

export default titreActivitePropUpdate
