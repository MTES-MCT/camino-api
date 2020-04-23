import 'dotenv/config'
import '../database/index'

import { administrationsGet } from '../database/queries/administrations'
import { activitesTypesGet } from '../database/queries/metas'
import { communesGet } from '../database/queries/territoires'
import { titresGet } from '../database/queries/titres'
import { titresActivitesGet } from '../database/queries/titres-activites'
import { titresDemarchesGet } from '../database/queries/titres-demarches'
import { titresEtapesGet } from '../database/queries/titres-etapes'
import { titresPointsGet } from '../database/queries/titres-points'

import titresActivitesStatutIdsUpdate from './processes/titres-activites-statut-ids-update'
import titresActivitesUpdate from './processes/titres-activites-update'
import titresAdministrationsGestionnairesUpdate from './processes/titres-administrations-gestionnaires-update'
import titresDatesUpdate from './processes/titres-dates-update'
import titresDemarchesOrdreUpdate from './processes/titres-demarches-ordre-update'
import titresDemarchesPublicUpdate from './processes/titres-demarches-public-update'
import titresDemarchesStatutIdUpdate from './processes/titres-demarches-statut-ids-update'
import titresEtapesAdministrationsLocalesUpdate from './processes/titres-etapes-administrations-locales-update'
import titresEtapesCommunesUpdate from './processes/titres-etapes-communes-update'
import titresEtapesOrdreUpdate from './processes/titres-etapes-ordre-update'
import { titresIdsUpdate } from './processes/titres-ids-update'
import titresPhasesUpdate from './processes/titres-phases-update'
import titresPointsReferencesCreate from './processes/titres-points-references-create'
import titresPropsEtapeIdUpdate from './processes/titres-props-etape-id-update'
import titresPropsContenuUpdate from './processes/titres-props-contenu-update'
import titresStatutIdsUpdate from './processes/titres-statut-ids-update'
import { titresActivitesRowsUpdate } from './titres-activites-rows-update'

const run = async () => {
  try {
    let titres

    console.info()
    console.info('ordre des étapes…')
    const titresDemarches = await titresDemarchesGet(
      {},
      {
        fields: {
          etapes: { id: {} },
          type: { etapesTypes: { id: {} } },
          titre: { id: {} }
        }
      },
      'super'
    )
    const titresEtapesOrdreUpdated = await titresEtapesOrdreUpdate(
      titresDemarches
    )

    console.info()
    console.info('statut des démarches…')
    titres = await titresGet(
      {
        domainesIds: null,
        entreprises: null,
        ids: null,
        noms: null,
        references: null,
        statutsIds: null,
        substances: null,
        territoires: null,
        typesIds: null
      },
      { fields: { demarches: { etapes: { id: {} } } } },
      'super'
    )
    const titresDemarchesStatutUpdated = await titresDemarchesStatutIdUpdate(
      titres
    )

    console.info()
    console.info('publicité des démarches…')
    titres = await titresGet(
      {
        domainesIds: null,
        entreprises: null,
        ids: null,
        noms: null,
        references: null,
        statutsIds: null,
        substances: null,
        territoires: null,
        typesIds: null
      },
      {
        fields: {
          demarches: {
            type: { etapesTypes: { id: {} } },
            etapes: { id: {} }
          }
        }
      },
      'super'
    )
    const titresDemarchesPublicUpdated = await titresDemarchesPublicUpdate(
      titres
    )

    console.info()
    console.info('ordre des démarches…')
    titres = await titresGet(
      {
        domainesIds: null,
        entreprises: null,
        ids: null,
        noms: null,
        references: null,
        statutsIds: null,
        substances: null,
        territoires: null,
        typesIds: null
      },
      { fields: { demarches: { etapes: { id: {} } } } },
      'super'
    )
    const titresDemarchesOrdreUpdated = await titresDemarchesOrdreUpdate(titres)

    console.info()
    console.info('statut des titres…')
    titres = await titresGet(
      {
        domainesIds: null,
        entreprises: null,
        ids: null,
        noms: null,
        references: null,
        statutsIds: null,
        substances: null,
        territoires: null,
        typesIds: null
      },
      {
        fields: {
          demarches: { phase: { id: {} }, etapes: { points: { id: {} } } }
        }
      },
      'super'
    )
    const titresStatutIdUpdated = await titresStatutIdsUpdate(titres)

    console.info()
    console.info('phases des titres…')
    titres = await titresGet(
      {
        domainesIds: null,
        entreprises: null,
        ids: null,
        noms: null,
        references: null,
        statutsIds: null,
        substances: null,
        territoires: null,
        typesIds: null
      },
      {
        fields: {
          demarches: { phase: { id: {} }, etapes: { points: { id: {} } } }
        }
      },
      'super'
    )
    const [
      titresPhasesUpdated = [],
      titresPhasesDeleted = []
    ] = await titresPhasesUpdate(titres)

    console.info()
    console.info('date de début, de fin et de demande initiale des titres…')
    titres = await titresGet(
      {
        domainesIds: null,
        entreprises: null,
        ids: null,
        noms: null,
        references: null,
        statutsIds: null,
        substances: null,
        territoires: null,
        typesIds: null
      },
      {
        fields: {
          demarches: { phase: { id: {} }, etapes: { points: { id: {} } } }
        }
      },
      'super'
    )
    const titresDatesUpdated = await titresDatesUpdate(titres)

    console.info()
    console.info('références des points…')
    const titresPoints = await titresPointsGet()
    const pointsReferencesCreated = await titresPointsReferencesCreate(
      titresPoints
    )

    console.info()
    console.info('communes associées aux étapes…')
    const titresEtapes = await titresEtapesGet(
      {
        etapesIds: null,
        etapesTypesIds: null,
        titresDemarchesIds: null
      },
      { fields: { points: { id: {} }, communes: { id: {} } } },
      'super'
    )
    const communes = await communesGet()
    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesCreated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapesCommunesUpdate(titresEtapes, communes)

    console.info()
    console.info('administrations gestionnaires associées aux titres…')

    titres = await titresGet(
      {
        domainesIds: null,
        entreprises: null,
        ids: null,
        noms: null,
        references: null,
        statutsIds: null,
        substances: null,
        territoires: null,
        typesIds: null
      },
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
      {
        domainesIds: null,
        entreprises: null,
        ids: null,
        noms: null,
        references: null,
        statutsIds: null,
        substances: null,
        territoires: null,
        typesIds: null
      },
      {
        fields: {
          demarches: {
            etapes: {
              administrations: { id: {} },
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

    console.info()
    console.info('propriétés des titres (liens vers les étapes)…')
    titres = await titresGet(
      {
        domainesIds: null,
        entreprises: null,
        ids: null,
        noms: null,
        references: null,
        statutsIds: null,
        substances: null,
        territoires: null,
        typesIds: null
      },
      {
        fields: {
          demarches: {
            etapes: {
              points: { id: {} },
              titulaires: { id: {} },
              amodiataires: { id: {} },
              administrations: { id: {} },
              substances: { id: {} },
              communes: { id: {} }
            }
          }
        }
      },
      'super'
    )
    const titresPropsEtapeIdUpdated = await titresPropsEtapeIdUpdate(titres)

    console.info()
    console.info(`propriétés des titres (liens vers les contenus d'étapes)…`)
    titres = await titresGet(
      {
        domainesIds: null,
        entreprises: null,
        ids: null,
        noms: null,
        references: null,
        statutsIds: null,
        substances: null,
        territoires: null,
        typesIds: null
      },
      { fields: { type: { id: {} }, demarches: { etapes: { id: {} } } } },
      'super'
    )
    const titresPropsContenuUpdated = await titresPropsContenuUpdate(titres)

    console.info()
    console.info('activités des titres…')
    titres = await titresGet(
      {
        domainesIds: null,
        entreprises: null,
        ids: null,
        noms: null,
        references: null,
        statutsIds: null,
        substances: null,
        territoires: null,
        typesIds: null
      },
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
      titres,
      activitesTypes
    )

    console.info()
    console.info('statut des activités dont le délai est dépassé')
    const titresActivites = await titresActivitesGet({}, {}, 'super')
    const titresActivitesStatutIdsUpdated = await titresActivitesStatutIdsUpdate(
      titresActivites
    )

    console.info()
    console.info('ids de titres, démarches, étapes et sous-éléments…')
    titres = await titresGet(
      {
        domainesIds: null,
        entreprises: null,
        ids: null,
        noms: null,
        references: null,
        statutsIds: null,
        substances: null,
        territoires: null,
        typesIds: null
      },
      {},
      'super'
    )

    const titresUpdatedIndex = await titresIdsUpdate(titres)

    console.info()
    console.info('tâches quotidiennes exécutées:')
    console.info(
      `mise à jour: ${titresEtapesOrdreUpdated.length} étape(s) (ordre)`
    )
    console.info(
      `mise à jour: ${titresDemarchesStatutUpdated.length} démarche(s) (statut)`
    )
    console.info(
      `mise à jour: ${titresDemarchesPublicUpdated.length} démarche(s) (publicité)`
    )
    console.info(
      `mise à jour: ${titresDemarchesOrdreUpdated.length} démarche(s) (ordre)`
    )
    console.info(
      `mise à jour: ${titresStatutIdUpdated.length} titre(s) (statuts)`
    )
    console.info(
      `mise à jour: ${titresPhasesUpdated.length} titre(s) (phases mises à jour)`
    )
    console.info(
      `mise à jour: ${titresPhasesDeleted.length} titre(s) (phases supprimées)`
    )
    console.info(
      `mise à jour: ${titresDatesUpdated.length} titre(s) (propriétés-dates)`
    )
    console.info(
      `création: ${pointsReferencesCreated.length} référence(s) de points`
    )
    console.info(`mise à jour: ${titreCommunesUpdated.length} commune(s)`)
    console.info(
      `mise à jour: ${titresEtapesCommunesCreated.length} commune(s) mise(s) à jour dans des étapes`
    )
    console.info(
      `mise à jour: ${titresEtapesCommunesDeleted.length} commune(s) supprimée(s) dans des étapes`
    )
    console.info(
      `mise à jour: ${titresAdministrationsGestionnairesCreated.length} administration(s) gestionnaire(s) ajoutée(s) dans des titres`
    )
    console.info(
      `mise à jour: ${titresAdministrationsGestionnairesDeleted.length} administration(s) gestionnaire(s) supprimée(s) dans des titres`
    )
    console.info(
      `mise à jour: ${titresEtapesAdministrationsLocalesCreated.length} administration(s) locale(s) ajoutée(s) dans des étapes`
    )
    console.info(
      `mise à jour: ${titresEtapesAdministrationsLocalesDeleted.length} administration(s) locale(s) supprimée(s) dans des étapes`
    )
    console.info(
      `mise à jour: ${titresPropsEtapeIdUpdated.length} titres(s) (propriétés-étapes)`
    )
    console.info(
      `mise à jour: ${titresPropsContenuUpdated.length} titres(s) (contenu)`
    )
    console.info(
      `mise à jour: ${titresActivitesCreated.length} activité(s) créée(s)`
    )
    console.info(
      `mise à jour: ${titresActivitesStatutIdsUpdated.length} activité(s) fermée(s)`
    )
    console.info(
      `mise à jour: ${Object.keys(titresUpdatedIndex).length} titre(s) (ids)`
    )

    console.info()
    console.info('exports vers les spreadsheets')

    // export des activités vers la spreadsheet camino-db-titres-activites-prod
    console.info('export des activités…')

    await titresActivitesRowsUpdate(titresActivitesCreated, titresUpdatedIndex)
  } catch (e) {
    console.info('erreur:', e)
  } finally {
    process.exit()
  }
}

run()
