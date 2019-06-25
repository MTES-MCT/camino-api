import { titreGet } from '../database/queries/titres'
import titresPropsActivitesUpdate from './processes/titres-props-activites-update'

const titreActivitePropUpdate = async titreId => {
  const titre = await titreGet(titreId)

  const titresPropsActivites = await titresPropsActivitesUpdate([titre])

  console.log(titresPropsActivites)
  console.log("Propriétés activités d'un titre mises à jour")
}

export default titreActivitePropUpdate
