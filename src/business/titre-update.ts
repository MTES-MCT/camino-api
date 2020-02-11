import { administrationsGet } from '../database/queries/administrations'
import { titreGet } from '../database/queries/titres'

import titresActivitesUpdate from './processes/titres-activites-update'
import titresAdministrationsGestionnairesUpdate from './processes/titres-administrations-gestionnaires-update'
import { titreIdsUpdate } from './processes/titres-ids-update'
import { activitesTypesGet } from '../database/queries/metas'
import { titreActivitesRowsUpdate } from './titres-activites-rows-update'

const titreUpdate = async (titreId: string) => {
  try {
    let titre = await titreGet(titreId, {
      graph: 'administrationsGestionnaires'
    })

    if (!titre) {
      console.log(`warning: le titre ${titreId} n'existe plus`)

      return null
    }

    // 9.
    console.log()
    console.log('administrations gestionnaires associées aux titres…')

    const administrations = await administrationsGet()
    const {
      titresAdministrationsGestionnairesCreated = [],
      titresAdministrationsGestionnairesDeleted = []
    } = await titresAdministrationsGestionnairesUpdate([titre], administrations)

    // 11.
    console.log()
    console.log('activités des titres…')
    titre = await titreGet(titreId)

    const activitesTypes = await activitesTypesGet()
    const titresActivitesCreated = await titresActivitesUpdate(
      [titre],
      activitesTypes
    )
    // 13.
    console.log()
    console.log('ids de titres, démarches, étapes et sous-éléments…')
    titre = await titreGet(titreId)
    // met à jour le ids dans le titre par effet de bord
    const titreUpdatedIndex = await titreIdsUpdate(titre)
    titreId = titreUpdatedIndex ? Object.keys(titreUpdatedIndex)[0] : titreId

    console.log()
    console.log('tâches métiers exécutées:')
    console.log(
      `mise à jour: ${titresAdministrationsGestionnairesCreated.length} administration(s) gestionnaire(s) ajoutée(s) dans des titres`
    )
    console.log(
      `mise à jour: ${titresAdministrationsGestionnairesDeleted.length} administration(s) gestionnaire(s) supprimée(s) dans des titres`
    )
    console.log(`mise à jour: ${titreUpdatedIndex ? '1' : '0'} titre(s) (ids)`)

    // export des activités vers la spreadsheet camino-db-titres-activites-prod
    if (titresActivitesCreated.length) {
      console.log('export des activités…')
      await titreActivitesRowsUpdate(titresActivitesCreated, titreUpdatedIndex)
    }

    return titreGet(titreId)
  } catch (e) {
    console.error(`erreur: titreUpdate ${titreId}`)
    console.error(e)
    throw e
  }
}

export default titreUpdate
