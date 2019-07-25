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
import titresPhasesUpdate from './processes/titres-phases-update'
import titresPropsActivitesUpdate from './processes/titres-props-activites-update'
import titresPropsEtapeIdUpdate from './processes/titres-props-etape-id-update'
import titresStatutIdsUpdate from './processes/titres-statut-ids-update'

import { titresIdsUpdate } from './processes/titres-ids-update'

const run = async () => {
  try {
    // 1.
    console.log('\nordre des étapes…')
    const titresDemarches = await titresDemarchesGet()
    const titresEtapesOrdre = await titresEtapesOrdreUpdate(titresDemarches)

    // 2.
    console.log('\nstatut des démarches…')
    let titres = await titresGet()
    const titresDemarchesStatutId = await titresDemarchesStatutIdUpdate(titres)

    // 3.
    console.log('\nordre des démarches…')
    titres = await titresGet()
    const titresDemarchesOrdre = await titresDemarchesOrdreUpdate(titres)

    // 4.
    console.log('\nstatut des titres…')
    titres = await titresGet()
    const titresStatutIds = await titresStatutIdsUpdate(titres)

    // 5.
    console.log('\nphases des titres…')
    titres = await titresGet()
    const titresPhases = await titresPhasesUpdate(titres)

    // 6.
    console.log('\ndate de début, de fin et de demande initiale des titres…')
    titres = await titresGet()
    const titresDates = await titresDatesUpdate(titres)

    // 7.
    console.log('\ncommunes associées aux étapes…')
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
        "\nAPI Géo Commune impossible: connexion impossible car la variable d'environnement est absente"
      ]
    }

    // 8.
    console.log('\nadministrations associées aux étapes…')
    titres = await titresGet()
    const administrations = await administrationsGet()
    const titresEtapesAdministrations = await titresEtapesAdministrationsUpdate(
      titres,
      administrations
    )

    // 9.
    console.log('\npropriétés des titres (liens vers les étapes)…')
    titres = await titresGet()
    const titresPropsEtapeId = await titresPropsEtapeIdUpdate(titres)

    // 10.
    // pour les année 2018 et 2019 (en dur)
    console.log('\nactivités des titres…')
    const annees = [2018, 2019]

    titres = await titresGet()
    const activitesTypes = await activitesTypesGet()
    const titresActivites = await titresActivitesUpdate(
      titres,
      activitesTypes,
      annees
    )

    // 11.
    console.log('\npropriétés des titres (activités abs, enc et dep)…')
    titres = await titresGet()
    const titresPropsActivites = await titresPropsActivitesUpdate(titres)

    // 12.
    console.log('\nids de titres, démarches, étapes et sous-éléments…')
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
    const titresIds = await titresIdsUpdate(titres)

    console.log('\ntâches quotidiennes exécutées:')
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
  } catch (e) {
    console.log('erreur:', e)
  } finally {
    process.exit()
  }
}

run()
