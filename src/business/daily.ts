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
    // 1.
    console.log()
    console.log('ordre des étapes…')
    const titresDemarches = await titresDemarchesGet(
      {},
      {
        fields: {
          etapes: { id: {} },
          type: {
            etapesTypes: { id: {} }
          }
        }
      }
    )
    const titresEtapesOrdreUpdated = await titresEtapesOrdreUpdate(
      titresDemarches
    )

    // 2.
    console.log()
    console.log('statut des démarches…')
    let titres = await titresGet(
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

    // 3.
    console.log()
    console.log('ordre des démarches…')
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

    // 4.
    console.log()
    console.log('statut des titres…')
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

    // 5.
    console.log()
    console.log('phases des titres…')
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

    // 6.
    console.log()
    console.log('date de début, de fin et de demande initiale des titres…')
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

    // 7.
    console.log()
    console.log('références des points…')
    const titresPoints = await titresPointsGet()
    const pointsReferencesCreated = await titresPointsReferencesCreate(
      titresPoints
    )

    // 8.
    console.log()
    console.log('communes associées aux étapes…')
    const titresEtapes = await titresEtapesGet(
      {
        etapesIds: null,
        etapesTypesIds: null,
        titresDemarchesIds: null
      },
      { graph: '[points, communes]' }
    )
    const communes = await communesGet()
    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesCreated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapesCommunesUpdate(titresEtapes, communes)

    // 9.
    console.log()
    console.log('administrations gestionnaires associées aux titres…')

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
        fields: { administrationsGestionnaires: { id: {} } }
      },
      'super'
    )
    let administrations = await administrationsGet({}, {}, 'super')
    const {
      titresAdministrationsGestionnairesCreated = [],
      titresAdministrationsGestionnairesDeleted = []
    } = await titresAdministrationsGestionnairesUpdate(titres, administrations)

    // 10.
    console.log()
    console.log('administrations locales associées aux étapes…')

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
              communes: { departements: { id: {} } }
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

    // 11.
    console.log()
    console.log('propriétés des titres (liens vers les étapes)…')
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

    // 12.
    console.log()
    console.log(`propriétés des titres (liens vers les contenus d'étapes)…`)
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

    // 13.
    console.log()
    console.log('activités des titres…')
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
      { fields: { demarches: { phase: { id: {} } } } },
      'super'
    )
    const activitesTypes = await activitesTypesGet()
    const titresActivitesCreated = await titresActivitesUpdate(
      titres,
      activitesTypes
    )

    // 14.
    console.log()
    console.log('statut des activités dont le délai est dépassé')
    const titresActivites = await titresActivitesGet({}, {}, 'super')
    const titresActivitesStatutIdsUpdated = await titresActivitesStatutIdsUpdate(
      titresActivites
    )

    // 15.
    console.log()
    console.log('ids de titres, démarches, étapes et sous-éléments…')
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

    console.log()
    console.log('tâches quotidiennes exécutées:')
    console.log(
      `mise à jour: ${titresEtapesOrdreUpdated.length} étape(s) (ordre)`
    )
    console.log(
      `mise à jour: ${titresDemarchesStatutUpdated.length} démarche(s) (statut)`
    )
    console.log(
      `mise à jour: ${titresDemarchesOrdreUpdated.length} démarche(s) (ordre)`
    )
    console.log(
      `mise à jour: ${titresStatutIdUpdated.length} titre(s) (statuts)`
    )
    console.log(
      `mise à jour: ${titresPhasesUpdated.length} titre(s) (phases mises à jour)`
    )
    console.log(
      `mise à jour: ${titresPhasesDeleted.length} titre(s) (phases supprimées)`
    )
    console.log(
      `mise à jour: ${titresDatesUpdated.length} titre(s) (propriétés-dates)`
    )
    console.log(
      `création: ${pointsReferencesCreated.length} référence(s) de points`
    )
    console.log(`mise à jour: ${titreCommunesUpdated.length} commune(s)`)
    console.log(
      `mise à jour: ${titresEtapesCommunesCreated.length} commune(s) mise(s) à jour dans des étapes`
    )
    console.log(
      `mise à jour: ${titresEtapesCommunesDeleted.length} commune(s) supprimée(s) dans des étapes`
    )
    console.log(
      `mise à jour: ${titresAdministrationsGestionnairesCreated.length} administration(s) gestionnaire(s) ajoutée(s) dans des titres`
    )
    console.log(
      `mise à jour: ${titresAdministrationsGestionnairesDeleted.length} administration(s) gestionnaire(s) supprimée(s) dans des titres`
    )
    console.log(
      `mise à jour: ${titresEtapesAdministrationsLocalesCreated.length} administration(s) locale(s) ajoutée(s) dans des étapes`
    )
    console.log(
      `mise à jour: ${titresEtapesAdministrationsLocalesDeleted.length} administration(s) locale(s) supprimée(s) dans des étapes`
    )
    console.log(
      `mise à jour: ${titresPropsEtapeIdUpdated.length} titres(s) (propriétés-étapes)`
    )
    console.log(
      `mise à jour: ${titresPropsContenuUpdated.length} titres(s) (contenu)`
    )
    console.log(
      `mise à jour: ${titresActivitesCreated.length} activité(s) créée(s)`
    )
    console.log(
      `mise à jour: ${titresActivitesStatutIdsUpdated.length} activité(s) fermée(s)`
    )
    console.log(
      `mise à jour: ${Object.keys(titresUpdatedIndex).length} titre(s) (ids)`
    )

    console.log()
    console.log('exports vers les spreadsheets')

    // export des activités vers la spreadsheet camino-db-titres-activites-prod
    console.log('export des activités…')

    await titresActivitesRowsUpdate(titresActivitesCreated, titresUpdatedIndex)
  } catch (e) {
    console.log('erreur:', e)
  } finally {
    process.exit()
  }
}

run()
