import administrationsUpdate from './processes/administrations-update'
import titresAdministrationsGestionnairesUpdate from './processes/titres-administrations-gestionnaires-update'
import titresEtapesAdministrationsLocalesUpdate from './processes/titres-etapes-administrations-locales-update'
import updatesLog from './_updates-log'

const administrationUpdate = async (administrationId: string) => {
  try {
    console.info()
    console.info('- - -')
    console.info(`mise à jour d'une administration : ${administrationId}`)

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

    updatesLog({
      titresAdministrationsGestionnairesCreated,
      titresAdministrationsGestionnairesDeleted,
      titresEtapesAdministrationsLocalesCreated,
      titresEtapesAdministrationsLocalesDeleted,
      administrationsUpdated
    })

    return administrationId
  } catch (e) {
    console.error(`erreur: administrationUpdate ${administrationId}`)
    console.error(e)

    throw e
  }
}

export default administrationUpdate
