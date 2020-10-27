import 'dotenv/config'
import '../init'

import {
  administrationGet,
  administrationsGet
} from '../database/queries/administrations'
import { departementsGet } from '../database/queries/territoires'

import administrationsUpdate from './processes/administrations-update'
import titresAdministrationsGestionnairesUpdate from './processes/titres-administrations-gestionnaires-update'
import { titresGet } from '../database/queries/titres'
import titresEtapesAdministrationsLocalesUpdate from './processes/titres-etapes-administrations-locales-update'

const administrationUpdate = async (administrationId: string) => {
  try {
    // mise à jour de l'administrations grâce à l'API Administration
    const departements = await departementsGet()
    const administration = await administrationGet(
      administrationId,
      {},
      'super'
    )

    const administrationsUpdated = await administrationsUpdate(
      [administration],
      departements
    )

    console.info()
    console.info('administrations gestionnaires associées aux titres…')

    let titres = await titresGet(
      {},
      { fields: { administrationsGestionnaires: { id: {} } } },
      'super'
    )

    let administrations

    administrations = await administrationsGet({}, {}, 'super')
    const {
      titresAdministrationsGestionnairesCreated = [],
      titresAdministrationsGestionnairesDeleted = []
    } = await titresAdministrationsGestionnairesUpdate(titres, administrations)

    console.info()
    console.info('administrations locales associées aux étapes…')

    titres = await titresGet(
      {},
      {
        fields: {
          demarches: {
            etapes: {
              administrations: { titresTypes: { id: {} } },
              communes: { departement: { id: {} } }
            }
          }
        }
      },
      'super'
    )
    administrations = await administrationsGet({}, {}, 'super')
    const [
      titresEtapesAdministrationsLocalesCreated = [],
      titresEtapesAdministrationsLocalesDeleted = []
    ] = await titresEtapesAdministrationsLocalesUpdate(titres, administrations)

    if (administrationsUpdated.length) {
      console.info(
        `mise à jour: ${administrationsUpdated.length} administration(s)`
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

    if (titresEtapesAdministrationsLocalesCreated.length) {
      console.info(
        `mise à jour: ${titresEtapesAdministrationsLocalesCreated.length} administration(s) locale(s) ajoutée(s) dans des étapes`
      )
    }

    if (titresEtapesAdministrationsLocalesDeleted.length) {
      console.info(
        `mise à jour: ${titresEtapesAdministrationsLocalesDeleted.length} administration(s) locale(s) supprimée(s) dans des étapes`
      )
    }

    return administrationId
  } catch (e) {
    console.error(`erreur: administrationUpdate ${administrationId}`)
    console.error(e)
    throw e
  }
}

export default administrationUpdate
