import administrationsUpdate from './processes/administrations-update'
import titresAdministrationsGestionnairesUpdate from './processes/titres-administrations-gestionnaires-update'
import titresEtapesAdministrationsLocalesUpdate from './processes/titres-etapes-administrations-locales-update'

const administrationUpdate = async (administrationId: string) => {
  try {
    console.info()
    console.info('- - -')
    console.info(`mise à jour d'une administration : ${administrationId}`)
    console.info()

    const administrationsUpdated = await administrationsUpdate([
      administrationId
    ])

    const {
      titresAdministrationsGestionnairesCreated = [],
      titresAdministrationsGestionnairesDeleted = []
    } = await titresAdministrationsGestionnairesUpdate()

    const {
      titresEtapesAdministrationsLocalesCreated,
      titresEtapesAdministrationsLocalesDeleted
    } = await titresEtapesAdministrationsLocalesUpdate()

    console.info()
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
