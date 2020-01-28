import '../database/index'

import { administrationsGet } from '../database/queries/administrations'
import { titreGet } from '../database/queries/titres'

import titresActivitesUpdate from './processes/titres-activites-update'
import titresAdministrationsGestionnairesUpdate from './processes/titres-administrations-gestionnaires-update'
import { titreActivitesRowUpdate } from '../tools/export/titre-activites'
import { titreIdsUpdate } from './processes/titres-ids-update'
import { activitesTypesGet } from '../database/queries/metas'

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
    const [
      titresAdministrationsGestionnairesCreated = [],
      titresAdministrationsGestionnairesDeleted = []
    ] = await titresAdministrationsGestionnairesUpdate([titre], administrations)

    // 11.
    console.log()
    console.log('activités des titres…')
    titre = await titreGet(titreId)

    const activitesTypes = await activitesTypesGet()
    let titresActivitesCreated = await titresActivitesUpdate(
      [titre],
      activitesTypes
    )

    // 13.
    console.log()
    console.log('ids de titres, démarches, étapes et sous-éléments…')
    titre = await titreGet(titreId)
    const titreUpdated = await titreIdsUpdate(titre)
    let titresIdsUpdatedIndex
    if (titreUpdated && titre.id !== titreUpdated.id) {
      titresActivitesCreated = titreUpdated.activites
      titreId = titreUpdated.id
      titresIdsUpdatedIndex = {
        [titreId]: titre.id
      }
    }

    console.log()
    console.log('tâches métiers exécutées:')
    console.log(
      `mise à jour: ${titresAdministrationsGestionnairesCreated.length} administration(s) gestionnaire(s) ajoutée(s) dans des titres`
    )
    console.log(
      `mise à jour: ${titresAdministrationsGestionnairesDeleted.length} administration(s) gestionnaire(s) supprimée(s) dans des titres`
    )
    console.log(`mise à jour: ${titreUpdated ? '1' : '0'} titre(s) (ids)`)

    if (titresActivitesCreated.length) {
      // export des activités vers la spreadsheet camino-db-titres-activites-prod
      console.log('export des activités…')
      await titreActivitesRowUpdate(
        titresActivitesCreated,
        titresIdsUpdatedIndex
      )
    }

    return titreGet(titreId)
  } catch (e) {
    console.error(`erreur: titreUpdate ${titreId}`)
    console.error(e)
    throw e
  }
}

export default titreUpdate