import { administrationsGet } from '../database/queries/administrations'
import { titreGet } from '../database/queries/titres'

import titresActivitesUpdate from './processes/titres-activites-update'
import titresAdministrationsGestionnairesUpdate from './processes/titres-administrations-gestionnaires-update'
import titresPublicUpdate from './processes/titres-public-update'
import { titreIdsUpdate } from './processes/titres-ids-update'
import { activitesTypesGet } from '../database/queries/metas'
import { titreActivitesRowsUpdate } from './titres-activites-rows-update'

const titreUpdate = async (titreId: string) => {
  try {
    let titre

    console.info()
    console.info('publicité des titres…')
    titre = await titreGet(
      titreId,
      {
        fields: {
          type: { autorisationsTitresStatuts: { id: {} } },
          demarches: { phase: { id: {} }, etapes: { points: { id: {} } } }
        }
      },
      'super'
    )
    const titresPublicUpdated = await titresPublicUpdate([titre])

    titre = await titreGet(
      titreId,
      {
        fields: { administrationsGestionnaires: { id: {} } }
      },
      'super'
    )

    if (!titre) {
      throw new Error(`warning: le titre ${titreId} n'existe plus`)
    }

    console.info()
    console.info('administrations gestionnaires associées aux titres…')

    const administrations = await administrationsGet({}, {}, 'super')
    const {
      titresAdministrationsGestionnairesCreated = [],
      titresAdministrationsGestionnairesDeleted = []
    } = await titresAdministrationsGestionnairesUpdate([titre], administrations)

    console.info()
    console.info('activités des titres…')
    titre = await titreGet(
      titreId,
      {
        fields: {
          demarches: { phase: { id: {} } },
          communes: { departement: { region: { pays: { id: {} } } } },
          activites: { id: {} }
        }
      },
      'super'
    )
    const activitesTypes = await activitesTypesGet({}, 'super')
    const titresActivitesCreated = await titresActivitesUpdate(
      [titre],
      activitesTypes
    )

    console.info()
    console.info('ids de titres, démarches, étapes et sous-éléments…')
    titre = await titreGet(
      titreId,
      {
        fields: {
          type: { id: {} },
          demarches: {
            etapes: {
              points: { references: { id: {} } },
              incertitudes: { id: {} }
            },
            phase: { id: {} }
          },
          activites: { id: {} }
        }
      },
      'super'
    )

    // met à jour l'id dans le titre par effet de bord
    const titreUpdatedIndex = await titreIdsUpdate(titre)
    titreId = titreUpdatedIndex ? Object.keys(titreUpdatedIndex)[0] : titreId

    console.info()
    console.info('tâches métiers exécutées:')
    console.info(
      `mise à jour: ${titresPublicUpdated.length} titre(s) (publicité)`
    )
    console.info(
      `mise à jour: ${titresAdministrationsGestionnairesCreated.length} administration(s) gestionnaire(s) ajoutée(s) dans des titres`
    )
    console.info(
      `mise à jour: ${titresAdministrationsGestionnairesDeleted.length} administration(s) gestionnaire(s) supprimée(s) dans des titres`
    )
    console.info(`mise à jour: ${titreUpdatedIndex ? '1' : '0'} titre(s) (ids)`)

    // export des activités vers la spreadsheet camino-db-titres-activites-prod
    if (titresActivitesCreated.length) {
      console.info('export des activités…')
      await titreActivitesRowsUpdate(titresActivitesCreated, titreUpdatedIndex)
    }

    return titreId
  } catch (e) {
    console.error(`erreur: titreUpdate ${titreId}`)
    console.error(e)
    throw e
  }
}

export default titreUpdate
