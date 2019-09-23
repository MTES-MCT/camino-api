import 'dotenv/config'
import '../database/index'

import { administrationsGet } from '../database/queries/administrations'
import { activitesTypesGet } from '../database/queries/metas'
import { communesGet } from '../database/queries/territoires'
import { titresGet } from '../database/queries/titres'
import { titresDemarchesGet } from '../database/queries/titres-demarches'
import { titresEtapesGet } from '../database/queries/titres-etapes'

import titresActivitesUpdate from './processes/titres-activites-update'
import titresDatesUpdate from './processes/titres-dates-update'
import titresDemarchesOrdreUpdate from './processes/titres-demarches-ordre-update'
import titresDemarchesStatutIdUpdate from './processes/titres-demarches-statut-ids-update'
import titresEtapesAdministrationsUpdate from './processes/titres-etapes-administrations-update'
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
    const titresDemarches = await titresDemarchesGet()
    const titresEtapesOrdreUpdated = await titresEtapesOrdreUpdate(
      titresDemarches
    )

    // 2.
    console.log()
    console.log('statut des démarches…')
    let titres = await titresGet()
    const titresDemarchesStatutUpdated = await titresDemarchesStatutIdUpdate(
      titres
    )

    // 3.
    console.log()
    console.log('ordre des démarches…')
    titres = await titresGet()
    const titresDemarchesOrdreUpdated = await titresDemarchesOrdreUpdate(titres)

    // 4.
    console.log()
    console.log('statut des titres…')
    titres = await titresGet()
    const titresStatutIdUpdated = await titresStatutIdsUpdate(titres)

    // 5.
    console.log()
    console.log('phases des titres…')
    titres = await titresGet()
    const titresPhasesUpdated = await titresPhasesUpdate(titres)

    // 6.
    console.log()
    console.log('date de début, de fin et de demande initiale des titres…')
    titres = await titresGet()
    const titresDatesUpdated = await titresDatesUpdate(titres)

    // 7.
    console.log()
    console.log('références des points…')
    titres = await titresGet()
    const pointsReferencesCreated = await titresPointsReferencesCreate(titres)

    // 8.
    console.log()
    console.log('communes associées aux étapes…')
    let titresEtapes

    titresEtapes = await titresEtapesGet()
    const communes = await communesGet()
    const [
      titreCommunesUpdated = [],
      titresEtapesCommunesCreated = [],
      titresEtapesCommunesDeleted = []
    ] = await titresEtapesCommunesUpdate(titresEtapes, communes)

    // 9.
    console.log()
    console.log('administrations associées aux étapes…')
    titres = await titresGet()
    const administrations = await administrationsGet()
    const [
      titresEtapesAdministrationsCreated = [],
      titresEtapesAdministrationsDeleted = []
    ] = await titresEtapesAdministrationsUpdate(titres, administrations)

    // 10.
    console.log()
    console.log('propriétés des titres (liens vers les étapes)…')
    titres = await titresGet()
    const titresPropsEtapeIdUpdated = await titresPropsEtapeIdUpdate(titres)

    // 11.
    console.log()
    console.log('activités des titres…')
    const annees = [2018, 2019]

    titres = await titresGet()
    const activitesTypes = await activitesTypesGet()
    let titresActivitesCreated = await titresActivitesUpdate(
      titres,
      activitesTypes,
      annees
    )

    // 12.
    console.log()
    console.log('propriétés des titres (activités abs, enc et dep)…')
    titres = await titresGet()
    const titresPropsActivitesUpdated = await titresPropsActivitesUpdate(titres)

    // 13.
    console.log()
    console.log('ids de titres, démarches, étapes et sous-éléments…')
    titres = await titresGet(
      {
        domaineIds: null,
        entreprises: null,
        noms: null,
        references: null,
        statutIds: null,
        substances: null,
        territoires: null,
        typeIds: null
      },
      { format: false }
    )
    const { titresUpdated = [], titresUpdatedIdsIndex } = await titresIdsUpdate(
      titres
    )
    let titresActivitesUpdated = []
    if (Object.keys(titresUpdatedIdsIndex).length) {
      titresActivitesUpdated = titresUpdated.reduce(
        (titresActivites, titreUpdated) => {
          if (titreUpdated.activites.length) {
            titresActivites.push(...titreUpdated.activites)
          }

          return titresActivites
        },
        []
      )

      titresActivitesCreated = titresActivitesCreated.filter(
        (tac: any) => !titresUpdatedIdsIndex[tac.titreId]
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
    console.log(`mise à jour: ${titresPhasesUpdated.length} titre(s) (phases)`)
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
      `mise à jour: ${titresEtapesAdministrationsCreated.length} administration(s) ajoutée(s) dans des étapes`
    )
    console.log(
      `mise à jour: ${titresEtapesAdministrationsDeleted.length} administration(s) supprimée(s) dans des étapes`
    )
    console.log(
      `mise à jour: ${titresPropsEtapeIdUpdated.length} titres(s) (propriétés-étapes)`
    )
    console.log(`mise à jour: ${titresActivitesCreated.length} activités`)
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
