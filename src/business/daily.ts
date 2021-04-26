import { titresActivitesStatutIdsUpdate } from './processes/titres-activites-statut-ids-update'
import { titresActivitesUpdate } from './processes/titres-activites-update'
import { titresAdministrationsGestionnairesUpdate } from './processes/titres-administrations-gestionnaires-update'
import { titresDatesUpdate } from './processes/titres-dates-update'
import { titresDemarchesOrdreUpdate } from './processes/titres-demarches-ordre-update'
import { titresDemarchesPublicUpdate } from './processes/titres-demarches-public-update'
import { titresDemarchesStatutIdUpdate } from './processes/titres-demarches-statut-ids-update'
import { titresEtapesAdministrationsLocalesUpdate } from './processes/titres-etapes-administrations-locales-update'
import { titresEtapesOrdreUpdate } from './processes/titres-etapes-ordre-update'
import { titresPhasesUpdate } from './processes/titres-phases-update'
import { titresPointsReferencesCreate } from './processes/titres-points-references-create'
import { titresPublicUpdate } from './processes/titres-public-update'
import { titresPropsEtapesIdsUpdate } from './processes/titres-props-etapes-ids-update'
import { titresContenusEtapesIdsUpdate } from './processes/titres-contenus-etapes-ids-update'
import { titresStatutIdsUpdate } from './processes/titres-statut-ids-update'
import { titresTravauxOrdreUpdate } from './processes/titres-travaux-ordre-update'
import { titresTravauxEtapesOrdreUpdate } from './processes/titres-travaux-etapes-ordre-update'
import { titresCoordonneesUpdate } from './processes/titres-coordonnees-update'
import { titresEtapesHeritagePropsUpdate } from './processes/titres-etapes-heritage-props-update'
import { titresEtapesHeritageContenuUpdate } from './processes/titres-etapes-heritage-contenu-update'
import { titresActivitesPropsUpdate } from './processes/titres-activites-props-update'
import { titresIdsUpdate } from './processes/titres-ids-update'
import { logsUpdate } from './_logs-update'

const daily = async () => {
  try {
    console.info()
    console.info('- - -')
    console.info('mise à jour quotidienne')

    const titresEtapesOrdreUpdated = await titresEtapesOrdreUpdate()
    const titresEtapesHeritagePropsUpdated = await titresEtapesHeritagePropsUpdate()
    const titresEtapesHeritageContenuUpdated = await titresEtapesHeritageContenuUpdate()
    const titresDemarchesStatutUpdated = await titresDemarchesStatutIdUpdate()
    const titresDemarchesPublicUpdated = await titresDemarchesPublicUpdate()
    const titresDemarchesOrdreUpdated = await titresDemarchesOrdreUpdate()
    const titresStatutIdUpdated = await titresStatutIdsUpdate()
    const titresPublicUpdated = await titresPublicUpdate()
    const [
      titresPhasesUpdated = [],
      titresPhasesDeleted = []
    ] = await titresPhasesUpdate()
    const titresDatesUpdated = await titresDatesUpdate()
    const pointsReferencesCreated = await titresPointsReferencesCreate()
    const {
      titresAdministrationsGestionnairesCreated = [],
      titresAdministrationsGestionnairesDeleted = []
    } = await titresAdministrationsGestionnairesUpdate()
    const {
      titresEtapesAdministrationsLocalesCreated,
      titresEtapesAdministrationsLocalesDeleted
    } = await titresEtapesAdministrationsLocalesUpdate()
    const titresPropsEtapesIdsUpdated = await titresPropsEtapesIdsUpdate()
    const titresContenusEtapesIdsUpdated = await titresContenusEtapesIdsUpdate()

    const titresCoordonneesUpdated = await titresCoordonneesUpdate()
    const titresTravauxEtapesOrdreUpdated = await titresTravauxEtapesOrdreUpdate()
    const titresTravauxOrdreUpdated = await titresTravauxOrdreUpdate()
    const titresActivitesCreated = await titresActivitesUpdate()
    const titresActivitesStatutIdsUpdated = await titresActivitesStatutIdsUpdate()
    const titresActivitesPropsUpdated = await titresActivitesPropsUpdate()
    // met à jour l'id dans le titre par effet de bord
    const titresUpdatedIndex = await titresIdsUpdate()

    logsUpdate({
      titresEtapesOrdreUpdated,
      titresEtapesHeritagePropsUpdated,
      titresEtapesHeritageContenuUpdated,
      titresDemarchesStatutUpdated,
      titresDemarchesPublicUpdated,
      titresDemarchesOrdreUpdated,
      titresStatutIdUpdated,
      titresPublicUpdated,
      titresPhasesUpdated,
      titresPhasesDeleted,
      titresDatesUpdated,
      pointsReferencesCreated,
      titresAdministrationsGestionnairesCreated,
      titresAdministrationsGestionnairesDeleted,
      titresEtapesAdministrationsLocalesCreated,
      titresEtapesAdministrationsLocalesDeleted,
      titresPropsEtapesIdsUpdated,
      titresContenusEtapesIdsUpdated,
      titresCoordonneesUpdated,
      titresTravauxEtapesOrdreUpdated,
      titresTravauxOrdreUpdated,
      titresActivitesCreated,
      titresActivitesStatutIdsUpdated,
      titresActivitesPropsUpdated,
      titresUpdatedIndex
    })
  } catch (e) {
    console.info('erreur:', e)

    throw e
  }
}

export default daily
