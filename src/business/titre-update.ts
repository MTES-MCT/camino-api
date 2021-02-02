import { titresActivitesUpdate } from './processes/titres-activites-update'
import { titresAdministrationsGestionnairesUpdate } from './processes/titres-administrations-gestionnaires-update'
import { titresPublicUpdate } from './processes/titres-public-update'
import { titresIdsUpdate } from './processes/titres-ids-update'
import { logsUpdate } from './_logs-update'

const titreUpdate = async (titreId: string) => {
  try {
    console.info()
    console.info('- - -')
    console.info(`mise à jour d'un titre : ${titreId}`)

    const titresPublicUpdated = await titresPublicUpdate([titreId])
    const {
      titresAdministrationsGestionnairesCreated = [],
      titresAdministrationsGestionnairesDeleted = []
    } = await titresAdministrationsGestionnairesUpdate([titreId])
    const titresActivitesCreated = await titresActivitesUpdate([titreId])
    // met à jour l'id dans le titre par effet de bord
    const titresUpdatedIndex = await titresIdsUpdate([titreId])
    const titreIdTmp = Object.keys(titresUpdatedIndex)[0]
    if (titreIdTmp) {
      titreId = titreIdTmp
    }

    logsUpdate({
      titresPublicUpdated,
      titresAdministrationsGestionnairesCreated,
      titresAdministrationsGestionnairesDeleted,
      titresActivitesCreated,
      titresUpdatedIndex
    })

    return titreId
  } catch (e) {
    console.error(`erreur: titreUpdate ${titreId}`)
    console.error(e)
    throw e
  }
}

export default titreUpdate
