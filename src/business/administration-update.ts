import administrationsUpdate from './processes/administrations-update'
import titresAdministrationsGestionnairesUpdate from './processes/titres-administrations-gestionnaires-update'
import titresEtapesAdministrationsLocalesUpdate from './processes/titres-etapes-administrations-locales-update'

const administrationUpdate = async (administrationId: string) => {
  try {
    const administrationsUpdated = await administrationsUpdate([
      administrationId
    ])

    console.info()
    const {
      titresAdministrationsGestionnairesCreated = [],
      titresAdministrationsGestionnairesDeleted = []
    } = await titresAdministrationsGestionnairesUpdate()

    console.info()
    const {
      titresEtapesAdministrationsLocalesCreated,
      titresEtapesAdministrationsLocalesDeleted
    } = await titresEtapesAdministrationsLocalesUpdate()

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
