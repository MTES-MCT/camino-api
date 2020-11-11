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
import titresPropsEtapeIdUpdate from './processes/titres-props-etape-id-update'
import titresPropsContenuUpdate from './processes/titres-props-contenu-update'
import titresStatutIdsUpdate from './processes/titres-statut-ids-update'
import titresTravauxOrdreUpdate from './processes/titres-travaux-ordre-update'
import titresTravauxEtapesOrdreUpdate from './processes/titres-travaux-etapes-ordre-update'
import { matomoCacheInit } from '../tools/api-matomo'

const daily = async () => {
  try {
    console.info()
    console.info('- - -')
    console.info('mise à jour quotidienne')
    console.info()

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
    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesCreated = [],
      titresEtapesCommunesDeleted = []
    ] = titresCommunes
    const [
      titreForetsUpdated = [],
      titresEtapesForetsCreated = [],
      titresEtapesForetsDeleted = []
    ] = titresForets
    const {
      titresAdministrationsGestionnairesCreated = [],
      titresAdministrationsGestionnairesDeleted = []
    } = await titresAdministrationsGestionnairesUpdate()
    const {
      titresEtapesAdministrationsLocalesCreated,
      titresEtapesAdministrationsLocalesDeleted
    } = await titresEtapesAdministrationsLocalesUpdate()
    const titresPropsEtapeIdUpdated = await titresPropsEtapeIdUpdate()
    const titresPropsContenuUpdated = await titresPropsContenuUpdate()
    const titresTravauxEtapesOrdreUpdated = await titresTravauxEtapesOrdreUpdate()
    const titresTravauxOrdreUpdated = await titresTravauxOrdreUpdate()
    const titresActivitesCreated = await titresActivitesUpdate()
    const titresActivitesStatutIdsUpdated = await titresActivitesStatutIdsUpdate()
    // met à jour l'id dans le titre par effet de bord
    const titresUpdatedIndex = await titresIdsUpdate()

    console.info('')
    console.info('rafraichissement du cache Matomo…')
    await matomoCacheInit()

    console.info()
    console.info('-')
    console.info('tâches exécutées:')
    if (titresEtapesOrdreUpdated.length) {
      console.info(
        `mise à jour: ${titresEtapesOrdreUpdated.length} étape(s) (ordre)`
      )
    }

    if (titresDemarchesStatutUpdated.length) {
      console.info(
        `mise à jour: ${titresDemarchesStatutUpdated.length} démarche(s) (statut)`
      )
    }

    if (titresDemarchesPublicUpdated.length) {
      console.info(
        `mise à jour: ${titresDemarchesPublicUpdated.length} démarche(s) (publicité)`
      )
    }

    if (titresDemarchesOrdreUpdated.length) {
      console.info(
        `mise à jour: ${titresDemarchesOrdreUpdated.length} démarche(s) (ordre)`
      )
    }

    if (titresStatutIdUpdated.length) {
      console.info(
        `mise à jour: ${titresStatutIdUpdated.length} titre(s) (statuts)`
      )
    }

    if (titresPublicUpdated.length) {
      console.info(
        `mise à jour: ${titresPublicUpdated.length} titre(s) (publicité)`
      )
    }

    if (titresPhasesUpdated.length) {
      console.info(
        `mise à jour: ${titresPhasesUpdated.length} titre(s) (phases mises à jour)`
      )
    }

    if (titresPhasesDeleted.length) {
      console.info(
        `mise à jour: ${titresPhasesDeleted.length} titre(s) (phases supprimées)`
      )
    }

    if (titresDatesUpdated.length) {
      console.info(
        `mise à jour: ${titresDatesUpdated.length} titre(s) (propriétés-dates)`
      )
    }

    if (pointsReferencesCreated.length) {
      console.info(
        `création: ${pointsReferencesCreated.length} référence(s) de points`
      )
    }

    if (titreCommunesUpdated.length) {
      console.info(`mise à jour: ${titreCommunesUpdated.length} commune(s)`)
    }

    if (titresEtapesCommunesCreated.length) {
      console.info(
        `mise à jour: ${titresEtapesCommunesCreated.length} commune(s) mise(s) à jour dans des étapes`
      )
    }

    if (titresEtapesCommunesDeleted.length) {
      console.info(
        `mise à jour: ${titresEtapesCommunesDeleted.length} commune(s) supprimée(s) dans des étapes`
      )
    }

    if (titreForetsUpdated.length) {
      console.info(`mise à jour: ${titreForetsUpdated.length} foret(s)`)
    }

    if (titresEtapesForetsCreated.length) {
      console.info(
        `mise à jour: ${titresEtapesForetsCreated.length} foret(s) mise(s) à jour dans des étapes`
      )
    }

    if (titresEtapesForetsDeleted.length) {
      console.info(
        `mise à jour: ${titresEtapesForetsDeleted.length} foret(s) supprimée(s) dans des étapes`
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

    if (titresPropsEtapeIdUpdated.length) {
      console.info(
        `mise à jour: ${titresPropsEtapeIdUpdated.length} titres(s) (propriétés-étapes)`
      )
    }

    if (titresPropsContenuUpdated.length) {
      console.info(
        `mise à jour: ${titresPropsContenuUpdated.length} titres(s) (contenu)`
      )
    }

    if (titresTravauxEtapesOrdreUpdated.length) {
      console.info(
        `mise à jour: ${titresTravauxEtapesOrdreUpdated.length} étape(s) de travaux (ordre)`
      )
    }

    if (titresTravauxOrdreUpdated.length) {
      console.info(
        `mise à jour: ${titresTravauxOrdreUpdated.length} travaux (ordre)`
      )
    }

    if (titresActivitesCreated.length) {
      console.info(
        `mise à jour: ${titresActivitesCreated.length} activité(s) créée(s)`
      )
    }

    if (titresActivitesStatutIdsUpdated.length) {
      console.info(
        `mise à jour: ${titresActivitesStatutIdsUpdated.length} activité(s) fermée(s)`
      )
    }

    if (Object.keys(titresUpdatedIndex).length) {
      console.info(
        `mise à jour: ${Object.keys(titresUpdatedIndex).length} titre(s) (ids)`
      )
    }
  } catch (e) {
    console.info('erreur:', e)

    throw e
  }
}

export default daily
