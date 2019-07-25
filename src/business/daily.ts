import 'dotenv/config'
import '../database/index'

import { titresGet } from '../database/queries/titres'
import { titresDemarchesGet } from '../database/queries/titres-demarches'
import { titresEtapesGet } from '../database/queries/titres-etapes'
import { communesGet } from '../database/queries/territoires'
import { activitesTypesGet } from '../database/queries/metas'
import { administrationsGet } from '../database/queries/administrations'

import titresEtapesOrdreUpdate from './processes/titres-etapes-ordre-update'
import titresDemarchesStatutIdUpdate from './processes/titres-demarches-statut-ids-update'
import titresDemarchesOrdreUpdate from './processes/titres-demarches-ordre-update'
import titresStatutIdsUpdate from './processes/titres-statut-ids-update'
import titresPhasesUpdate from './processes/titres-phases-update'
import titresDatesUpdate from './processes/titres-dates-update'
import titresEtapesCommunesUpdate from './processes/titres-etapes-communes-update'
import titresEtapesAdministrationsUpdate from './processes/titres-etapes-administrations-update'
import titresPropsEtapeIdUpdate from './processes/titres-props-etape-id-update'
import titresActivitesUpdate from './processes/titres-activites-update'
import titresPropsActivitesUpdate from './processes/titres-props-activites-update'

import { titresIdsUpdate } from './processes/titres-ids-update'

const run = async () => {
  try {
    // 1.
    console.log('ordre des étapes…')
    let titresDemarches = await titresDemarchesGet()
    const titresEtapesOrdre = await titresEtapesOrdreUpdate(titresDemarches)

    // 2.
    console.log('statut des démarches…')
    let titres = await titresGet()
    const titresDemarchesStatutId = await titresDemarchesStatutIdUpdate(titres)

    // 3.
    console.log('ordre des démarches…')
    titres = await titresGet()
    const titresDemarchesOrdre = await titresDemarchesOrdreUpdate(titres)

    // 4.
    console.log('statut des titres…')
    titres = await titresGet()
    const titresStatutIds = await titresStatutIdsUpdate(titres)

    // 5.
    console.log('phases des titres…')
    titres = await titresGet()
    const titresPhases = await titresPhasesUpdate(titres)

    // 6.
    console.log("date de début, de fin et de demande initiale des titres…")
    titres = await titresGet()
    const titresDates = await titresDatesUpdate(titres)

    // 7.
    console.log('communes associées aux étapes…')
    let titresEtapes
    let titresEtapesCommunes
    if (process.env.GEO_API_URL) {
      titresEtapes = await titresEtapesGet()
      const communes = await communesGet()
      titresEtapesCommunes = await titresEtapesCommunesUpdate(
        titresEtapes,
        communes
      )
    } else {
      titresEtapesCommunes = [
        "Connexion à l'API Géo Commune impossible: variable d'environnement manquante"
      ]
    }

    // 8.
    console.log('administrations associées aux étapes…')
    titres = await titresGet()
    const administrations = await administrationsGet()
    const titresEtapesAdministrations = await titresEtapesAdministrationsUpdate(
      titres,
      administrations
    )
    
    // 9.
    console.log('propriétés des titres (liens vers les étapes)…')
    titres = await titresGet()
    const titresPropsEtapeId = await titresPropsEtapeIdUpdate(titres)

    // 10.
    // pour les année 2018 et 2019 (en dur)
    console.log('activités des titres…')
    const annees = [2018, 2019]

    titres = await titresGet()
    const activitesTypes = await activitesTypesGet()
    const titresActivites = await titresActivitesUpdate(
      titres,
      activitesTypes,
      annees
    )

    // 11.
    console.log('propriétés des titres (activités abs, enc et dep)…')
    titres = await titresGet()
    const titresPropsActivites = await titresPropsActivitesUpdate(titres)

    // 12.
    console.log('ids de titres, démarches, étapes et sous-éléments…')
    titres = await titresGet(
      {
        typeIds: null,
        domaineIds: null,
        statutIds: null,
        substances: null,
        noms: null,
        entreprises: null,
        references: null,
        territoires: null
      },
      { format: false }
    )
    const titresIds = await titresIdsUpdate(titres)

    // logs
    console.log(titresEtapesOrdre)
    console.log(titresDemarchesStatutId)
    console.log(titresDemarchesOrdre)
    console.log(titresStatutIds)
    console.log(titresPhases)
    console.log(titresDates)
    console.log(titresEtapesCommunes.join('\n'))
    console.log(titresEtapesAdministrations.join('\n'))
    console.log(titresPropsEtapeId)
    console.log(titresActivites)
    console.log(titresPropsActivites)
    console.log(titresIds)

    console.log('Tâches quotidiennes exécutées')
  } catch (e) {
    console.log('Erreur:', e)
  } finally {
    process.exit()
  }
}

run()
