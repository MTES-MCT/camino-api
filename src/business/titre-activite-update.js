import { titreActiviteGet } from '../database/queries/titres-activites'
import { titreGet } from '../database/queries/titres'
import titresPropsActivitesUpdate from './processes/titres-props-activites-update'

const titreActiviteUpdate = async titreActiviteId => {
  const activite = await titreActiviteGet(titreActiviteId)
  const titre = await titreGet(activite.titreId)

  console.log('propriétés des titres (liens vers les étapes)…')
  const titresPropsActivitesUpdated = await titresPropsActivitesUpdate([titre])

  console.log(
    `mise à jour: ${titresPropsActivitesUpdated.length} titre(s) (propriétés-activités)`
  )
}

export default titreActiviteUpdate
