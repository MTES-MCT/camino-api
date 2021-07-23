import { titresActivitesUpdate } from './processes/titres-activites-update'
import { titresAdministrationsGestionnairesUpdate } from './processes/titres-administrations-gestionnaires-update'
import { titresPublicUpdate } from './processes/titres-public-update'
import { titresSlugsUpdate } from './processes/titres-slugs-update'
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
    const titresUpdatedIndex = await titresSlugsUpdate([titreId])

    logsUpdate({
      titresPublicUpdated,
      titresAdministrationsGestionnairesCreated,
      titresAdministrationsGestionnairesDeleted,
      titresActivitesCreated,
      titresUpdatedIndex
    })
  } catch (e) {
    console.error(`erreur: titreUpdate ${titreId}`)
    console.error(e)
    throw e
  }
}

export default titreUpdate
