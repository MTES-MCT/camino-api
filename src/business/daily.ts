import 'dotenv/config'
import '../init'

import { administrationsGet } from '../database/queries/administrations'
import { activitesTypesGet } from '../database/queries/metas'
import { communesGet, foretsGet } from '../database/queries/territoires'
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
import { titresTravauxGet } from '../database/queries/titres-travaux'
import titresTravauxEtapesOrdreUpdate from './processes/titres-travaux-etapes-ordre-update'
import { matomoCacheInit } from '../tools/api-matomo'

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
      {},
      { fields: { demarches: { etapes: { id: {} } } } },
      'super'
    )
    const titresDemarchesStatutUpdated = await titresDemarchesStatutIdUpdate(
      titres
    )

    console.info()
    console.info('publicité des démarches…')
    titres = await titresGet(
      {},
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
      {},
      { fields: { demarches: { etapes: { id: {} } } } },
      'super'
    )
    const titresDemarchesOrdreUpdated = await titresDemarchesOrdreUpdate(titres)

    console.info()
    console.info('statut des titres…')
    titres = await titresGet(
      {},
      {
        fields: {
          demarches: { phase: { id: {} }, etapes: { points: { id: {} } } }
        }
      },
      'super'
    )
    const titresStatutIdUpdated = await titresStatutIdsUpdate(titres)

    console.info()
    console.info('publicité des titres…')
    titres = await titresGet(
      {},
      {
        fields: {
          type: { autorisationsTitresStatuts: { id: {} } },
          demarches: { phase: { id: {} }, etapes: { points: { id: {} } } }
        }
      },
      'super'
    )
    const titresPublicUpdated = await titresPublicUpdate(titres)

    console.info()
    console.info('phases des titres…')
    titres = await titresGet(
      {},
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
      {},
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
    console.info('communes et forêts associées aux étapes…')
    const titresEtapes = await titresEtapesGet(
      {
        etapesIds: null,
        etapesTypesIds: null,
        titresDemarchesIds: null
      },
      {
        fields: { points: { id: {} }, communes: { id: {} }, forets: { id: {} } }
      },
      'super'
    )

    const communes = await communesGet()
    const forets = await foretsGet()

    const { titresCommunes, titresForets } = await titresEtapesAreasUpdate(
      titresEtapes,
      communes,
      forets
    )

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

    console.info()
    console.info('administrations gestionnaires associées aux titres…')

    titres = await titresGet(
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
    const titresEtapesAdministrationsLocalesUpdated = await titresEtapesAdministrationsLocalesUpdate(
      titres,
      administrations
    )
    const titresEtapesAdministrationsLocalesCreated = titresEtapesAdministrationsLocalesUpdated[0].map(
      teal => teal.titreEtapeId
    )
    const titresEtapesAdministrationsLocalesDeleted =
      titresEtapesAdministrationsLocalesUpdated[1]

    console.info()
    console.info('propriétés des titres (liens vers les étapes)…')
    titres = await titresGet(
      {},
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
      {},
      { fields: { type: { id: {} }, demarches: { etapes: { id: {} } } } },
      'super'
    )
    const titresPropsContenuUpdated = await titresPropsContenuUpdate(titres)

    console.info()
    console.info('ordre des étapes de travaux…')
    const titreTravaux = await titresTravauxGet(
      {},
      {
        fields: {
          etapes: { id: {} },
          type: { etapesTypes: { id: {} } },
          titre: { id: {} }
        }
      }
    )

    const titresTravauxEtapesOrdreUpdated = await titresTravauxEtapesOrdreUpdate(
      titreTravaux
    )

    console.info()
    console.info(`ordre des travaux…`)
    titres = await titresGet(
      {},
      { fields: { travaux: { etapes: { id: {} } } } },
      'super'
    )
    const titresTravauxOrdreUpdated = await titresTravauxOrdreUpdate(titres)

    console.info()
    console.info('activités des titres…')
    titres = await titresGet(
      {},
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
    // si l'id du titre change il est effacé puis re-créé entièrement
    // on doit donc récupérer toutes ses relations
    titres = await titresGet(
      {},
      {
        fields: {
          type: { type: { id: {} } },
          references: { id: {} },
          administrationsGestionnaires: { id: {} },
          demarches: {
            etapes: {
              points: { references: { id: {} } },
              documents: { id: {} },
              administrations: { id: {} },
              titulaires: { id: {} },
              amodiataires: { id: {} },
              substances: { id: {} },
              communes: { id: {} },
              justificatifs: { id: {} },
              incertitudes: { id: {} }
            },
            phase: { id: {} }
          },
          travaux: { etapes: { id: {} } },
          activites: { id: {} }
        }
      },
      'super'
    )

    // met à jour l'id dans le titre par effet de bord
    const titresUpdatedIndex = await titresIdsUpdate(titres)

    console.info()
    console.info('rafraichissement du cache Matomo…')
    await matomoCacheInit()

    console.info()
    console.info('tâches quotidiennes exécutées:')
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
  } finally {
    process.exit()
  }
}

run()
