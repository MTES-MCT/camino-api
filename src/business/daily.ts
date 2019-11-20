import 'dotenv/config'
import '../database/index'

import { administrationsGet } from '../database/queries/administrations'
import { activitesTypesGet } from '../database/queries/metas'
import { communesGet } from '../database/queries/territoires'
import { titresGet } from '../database/queries/titres'
import { titresDemarchesGet } from '../database/queries/titres-demarches'
import { titresEtapesGet } from '../database/queries/titres-etapes'
import { titresPointsGet } from '../database/queries/titres-points'

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
import titresPropsActivitesUpdate from './processes/titres-props-activites-update'
import titresPropsEtapeIdUpdate from './processes/titres-props-etape-id-update'
import titresStatutIdsUpdate from './processes/titres-statut-ids-update'

import { titreActivitesRowUpdate } from '../tools/export/titre-activites'

const run = async () => {
  try {
    // 1.
    console.log()
    console.log('ordre des étapes…')
    const titresDemarches = await titresDemarchesGet(
      { demarchesIds: null, titresIds: null },
      { eager: '[etapes, type.[etapesTypes]]' }
    )
    const titresEtapesOrdreUpdated = await titresEtapesOrdreUpdate(
      titresDemarches
    )

    // 2.
    console.log()
    console.log('statut des démarches…')
    let titres = await titresGet(
      {
        domaineIds: null,
        entreprises: null,
        ids: null,
        noms: null,
        references: null,
        statutIds: null,
        substances: null,
        territoires: null,
        typeIds: null
      },
      { eager: 'demarches(orderDesc).[etapes(orderDesc)]' }
    )
    const titresDemarchesStatutUpdated = await titresDemarchesStatutIdUpdate(
      titres
    )

    // 3.
    console.log()
    console.log('ordre des démarches…')
    titres = await titresGet(
      {
        domaineIds: null,
        entreprises: null,
        ids: null,
        noms: null,
        references: null,
        statutIds: null,
        substances: null,
        territoires: null,
        typeIds: null
      },
      {
        eager: 'demarches(orderDesc).[etapes(orderDesc)]'
      }
    )
    const titresDemarchesOrdreUpdated = await titresDemarchesOrdreUpdate(titres)

    // 4.
    console.log()
    console.log('statut des titres…')
    titres = await titresGet(
      {
        domaineIds: null,
        entreprises: null,
        ids: null,
        noms: null,
        references: null,
        statutIds: null,
        substances: null,
        territoires: null,
        typeIds: null
      },
      { eager: 'demarches(orderDesc).[etapes(orderDesc).[points]]' }
    )
    const titresStatutIdUpdated = await titresStatutIdsUpdate(titres)

    // 5.
    console.log()
    console.log('phases des titres…')
    titres = await titresGet(
      {
        domaineIds: null,
        entreprises: null,
        ids: null,
        noms: null,
        references: null,
        statutIds: null,
        substances: null,
        territoires: null,
        typeIds: null
      },
      { eager: 'demarches(orderDesc).[phase,etapes(orderDesc).[points]]' }
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
        domaineIds: null,
        entreprises: null,
        ids: null,
        noms: null,
        references: null,
        statutIds: null,
        substances: null,
        territoires: null,
        typeIds: null
      },
      { eager: 'demarches(orderDesc).[etapes(orderDesc).[points]]' }
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
        etapesTypeIds: null,
        titresDemarchesIds: null
      },
      { eager: '[points, communes]' }
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
        domaineIds: null,
        entreprises: null,
        ids: null,
        noms: null,
        references: null,
        statutIds: null,
        substances: null,
        territoires: null,
        typeIds: null
      },
      {
        eager: 'administrationsGestionnaires'
      }
    )
    let administrations = await administrationsGet()
    const [
      titresAdministrationsGestionnairesCreated = [],
      titresAdministrationsGestionnairesDeleted = []
    ] = await titresAdministrationsGestionnairesUpdate(titres, administrations)

    // 10.
    console.log()
    console.log('administrations locales associées aux étapes…')

    titres = await titresGet(
      {
        domaineIds: null,
        entreprises: null,
        ids: null,
        noms: null,
        references: null,
        statutIds: null,
        substances: null,
        territoires: null,
        typeIds: null
      },
      {
        eager:
          'demarches(orderDesc).etapes(orderDesc).[administrations, communes.[departement]]'
      }
    )
    administrations = await administrationsGet()
    const [
      titresEtapesAdministrationsLocalesCreated = [],
      titresEtapesAdministrationsLocalesDeleted = []
    ] = await titresEtapesAdministrationsLocalesUpdate(titres, administrations)

    // 11.
    console.log()
    console.log('propriétés des titres (liens vers les étapes)…')
    titres = await titresGet(
      {
        domaineIds: null,
        entreprises: null,
        ids: null,
        noms: null,
        references: null,
        statutIds: null,
        substances: null,
        territoires: null,
        typeIds: null
      },
      {
        eager:
          'demarches(orderDesc).[etapes(orderDesc).[points, titulaires, amodiataires, administrations, substances, communes]]'
      }
    )
    const titresPropsEtapeIdUpdated = await titresPropsEtapeIdUpdate(titres)

    // 12.
    console.log()
    console.log('activités des titres…')
    titres = await titresGet(
      {
        domaineIds: null,
        entreprises: null,
        ids: null,
        noms: null,
        references: null,
        statutIds: null,
        substances: null,
        territoires: null,
        typeIds: null
      },
      {
        eager:
          '[activites, demarches(orderDesc).[phase], communes.departement.region.pays]'
      }
    )
    const activitesTypes = await activitesTypesGet()
    const annees = [2018, 2019]
    let titresActivitesCreated = await titresActivitesUpdate(
      titres,
      activitesTypes,
      annees
    )

    // 13.
    console.log()
    console.log('propriétés des titres (activités abs, enc et dep)…')
    titres = await titresGet(
      {
        domaineIds: null,
        entreprises: null,
        ids: null,
        noms: null,
        references: null,
        statutIds: null,
        substances: null,
        territoires: null,
        typeIds: null
      },
      {
        eager: 'activites'
      }
    )
    const titresPropsActivitesUpdated = await titresPropsActivitesUpdate(titres)

    // 14.
    console.log()
    console.log('ids de titres, démarches, étapes et sous-éléments…')
    titres = await titresGet({
      domaineIds: null,
      entreprises: null,
      ids: null,
      noms: null,
      references: null,
      statutIds: null,
      substances: null,
      territoires: null,
      typeIds: null
    })
    const { titresUpdated = [], titresUpdatedIdsIndex } = await titresIdsUpdate(
      titres
    )

    let titresActivitesUpdated = []
    if (Object.keys(titresUpdatedIdsIndex).length) {
      const titresOldIdsIndex = Object.keys(titresUpdatedIdsIndex).reduce(
        (acc: any, titreOldId) => {
          acc[titresUpdatedIdsIndex[titreOldId]] = titreOldId

          return acc
        },
        {}
      )

      titresActivitesUpdated = titresUpdated.reduce(
        (titresActivites: any, titreUpdated: any) => {
          if (titreUpdated.activites.length) {
            titresActivites.push(...titreUpdated.activites)
          }

          return titresActivites
        },
        []
      )

      titresActivitesCreated = titresActivitesCreated.filter(
        (tac: any) => !titresOldIdsIndex[tac.titreId]
      )
    }

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
      `mise à jour: ${titresEtapesCommunesCreated.length} commune(s) ajoutée(s) dans des étapes`
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
    console.log(`mise à jour: ${titresActivitesCreated.length} activité(s)`)
    console.log(
      `mise à jour: ${titresPropsActivitesUpdated.length} titre(s) (propriétés-activités)`
    )
    console.log(`mise à jour: ${titresUpdated.length} titre(s) (ids)`)

    console.log()
    console.log('exports vers les spreadsheets')

    // export des activités vers la spreadsheet camino-db-titres-activites-prod
    console.log('export des activités…')
    await titreActivitesRowUpdate(
      [...titresActivitesCreated, ...titresActivitesUpdated],
      titresUpdatedIdsIndex
    )
  } catch (e) {
    console.log('erreur:', e)
  } finally {
    process.exit()
  }
}

run()
