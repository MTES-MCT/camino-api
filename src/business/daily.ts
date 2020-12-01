import titresActivitesStatutIdsUpdate from './processes/titres-activites-statut-ids-update'
import titresActivitesUpdate from './processes/titres-activites-update'
import titresAdministrationsGestionnairesUpdate from './processes/titres-administrations-gestionnaires-update'
import titresDatesUpdate from './processes/titres-dates-update'
import titresDemarchesOrdreUpdate from './processes/titres-demarches-ordre-update'
import titresDemarchesPublicUpdate from './processes/titres-demarches-public-update'
import titresDemarchesStatutIdUpdate from './processes/titres-demarches-statut-ids-update'
import titresEtapesAdministrationsLocalesUpdate from './processes/titres-etapes-administrations-locales-update'
import { titresEtapesAreasUpdate } from './processes/titres-etapes-areas-update'
import titresEtapesOrdreUpdate from './processes/titres-etapes-ordre-update'
import { titresIdsUpdate } from './processes/titres-ids-update'
import titresPhasesUpdate from './processes/titres-phases-update'
import titresPointsReferencesCreate from './processes/titres-points-references-create'
import titresPublicUpdate from './processes/titres-public-update'
import titresPropsEtapesIdsUpdate from './processes/titres-props-etapes-ids-update'
import titresPropsContenuUpdate from './processes/titres-props-contenu-update'
import titresStatutIdsUpdate from './processes/titres-statut-ids-update'
import titresTravauxOrdreUpdate from './processes/titres-travaux-ordre-update'
import titresTravauxEtapesOrdreUpdate from './processes/titres-travaux-etapes-ordre-update'
import { matomoCacheInit } from '../tools/api-matomo'
import updatesLog from './_updates-log'
import titresCoordonneesUpdate from './processes/titres-coordonnees-update'

const daily = async () => {
  try {
    console.info()
    console.info('- - -')
    console.info('mise à jour quotidienne')

    const titresEtapesOrdreUpdated = await titresEtapesOrdreUpdate()
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
    const { titresCommunes, titresForets } = await titresEtapesAreasUpdate()
    const {
      areasUpdated: communesUpdated = [],
      titresEtapesAreasUpdated: titresEtapesCommunesUpdated = [],
      titresEtapesAreasDeleted: titresEtapesCommunesDeleted = []
    } = titresCommunes
    const {
      areasUpdated: foretsUpdated = [],
      titresEtapesAreasUpdated: titresEtapesForetsUpdated = [],
      titresEtapesAreasDeleted: titresEtapesForetsDeleted = []
    } = titresForets
    const {
      titresAdministrationsGestionnairesCreated = [],
      titresAdministrationsGestionnairesDeleted = []
    } = await titresAdministrationsGestionnairesUpdate()
    const {
      titresEtapesAdministrationsLocalesCreated,
      titresEtapesAdministrationsLocalesDeleted
    } = await titresEtapesAdministrationsLocalesUpdate()
    const titresPropsEtapesIdsUpdated = await titresPropsEtapesIdsUpdate()
    const titresPropsContenuUpdated = await titresPropsContenuUpdate()

    const titresCoordonneesUpdated = await titresCoordonneesUpdate()
    const titresTravauxEtapesOrdreUpdated = await titresTravauxEtapesOrdreUpdate()
    const titresTravauxOrdreUpdated = await titresTravauxOrdreUpdate()
    const titresActivitesCreated = await titresActivitesUpdate()
    const titresActivitesStatutIdsUpdated = await titresActivitesStatutIdsUpdate()
    // met à jour l'id dans le titre par effet de bord
    const titresUpdatedIndex = await titresIdsUpdate()

    console.info('')
    console.info('rafraichissement du cache Matomo…')
    await matomoCacheInit()

    updatesLog({
      titresEtapesOrdreUpdated,
      titresDemarchesStatutUpdated,
      titresDemarchesPublicUpdated,
      titresDemarchesOrdreUpdated,
      titresStatutIdUpdated,
      titresPublicUpdated,
      titresPhasesUpdated,
      titresPhasesDeleted,
      titresDatesUpdated,
      pointsReferencesCreated,
      communesUpdated,
      titresEtapesCommunesUpdated,
      titresEtapesCommunesDeleted,
      foretsUpdated,
      titresEtapesForetsUpdated,
      titresEtapesForetsDeleted,
      titresAdministrationsGestionnairesCreated,
      titresAdministrationsGestionnairesDeleted,
      titresEtapesAdministrationsLocalesCreated,
      titresEtapesAdministrationsLocalesDeleted,
      titresPropsEtapesIdsUpdated,
      titresPropsContenuUpdated,
      titresCoordonneesUpdated,
      titresTravauxEtapesOrdreUpdated,
      titresTravauxOrdreUpdated,
      titresActivitesCreated,
      titresActivitesStatutIdsUpdated,
      titresUpdatedIndex
    })
  } catch (e) {
    console.info('erreur:', e)

    throw e
  }
}

export default daily
