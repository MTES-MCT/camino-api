import titresActivitesUpdate from './processes/titres-activites-update'
import titresAdministrationsGestionnairesUpdate from './processes/titres-administrations-gestionnaires-update'
import titresPublicUpdate from './processes/titres-public-update'
import { titresIdsUpdate } from './processes/titres-ids-update'

const titreUpdate = async (titreId: string) => {
  try {
    console.info()
    const titresPublicUpdated = await titresPublicUpdate([titreId])

    console.info()
    const {
      titresAdministrationsGestionnairesCreated = [],
      titresAdministrationsGestionnairesDeleted = []
    } = await titresAdministrationsGestionnairesUpdate([titreId])

    console.info()
    const titresActivitesCreated = await titresActivitesUpdate([titreId])

    console.info()
    // met à jour l'id dans le titre par effet de bord
    const titresUpdatedIndex = await titresIdsUpdate([titreId])
    const titreIdTmp = Object.keys(titresUpdatedIndex)[0]
    if (titreIdTmp) {
      titreId = titreIdTmp
    }

    console.info()
    console.info('tâches métiers exécutées:')
    if (titresPublicUpdated.length) {
      console.info(
        `mise à jour: ${titresPublicUpdated.length} titre(s) (publicité)`
      )
    }

    if (titresAdministrationsGestionnairesCreated.length) {
      console.info(
        `mise à jour: ${titresAdministrationsGestionnairesCreated.length} administration(s) gestionnaire(s) ajoutée(s) dans des titres`
      )
    }

    if (titresAdministrationsGestionnairesDeleted.length) {
      console.info(
        `mise à jour: ${titresAdministrationsGestionnairesDeleted.length} administration(s) gestionnaire(s) supprimée(s) dans des titres`
      )
    }

    if (titresActivitesCreated.length) {
      console.info(`mise à jour: ${titresActivitesCreated.length} activités`)
    }

    if (titresUpdatedIndex) {
      console.info(`mise à jour: 1 titre (id) ${titresUpdatedIndex}`)
    }

    return titreId
  } catch (e) {
    console.error(`erreur: titreUpdate ${titreId}`)
    console.error(e)
    throw e
  }
}

export default titreUpdate
