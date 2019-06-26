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
import titresActivitesTypesUpdate from './processes/titres-activites-update'
import titresPropsActivitesUpdate from './processes/titres-props-activites-update'

import titresIdsUpdate from './processes/titres-ids-update'

const run = async () => {
  try {
    // 1.
    // ordre des étapes
    // en fonction de leur date
    let titresDemarches = await titresDemarchesGet()
    const titresEtapesOrdre = await titresEtapesOrdreUpdate(titresDemarches)

    // 2.
    // statut des démarches
    // en fonction de ses étapes (type, ordre, statut)
    let titres = await titresGet()
    const titresDemarchesStatutId = await titresDemarchesStatutIdUpdate(titres)

    // 3.
    // détermine l'ordre des démarche
    // en fonction de la date de leur première étape
    titres = await titresGet()
    const titresDemarchesOrdre = await titresDemarchesOrdreUpdate(titres)

    // 4.
    // statut des titres
    // en fonction des démarches et de la date du jour
    titres = await titresGet()
    const titresStatutIds = await titresStatutIdsUpdate(titres)

    // 5.
    // phases des titres
    // en fonction des démarches et de la date du jour
    titres = await titresGet()
    const titresPhases = await titresPhasesUpdate(titres)

    // 6.
    // date de début, de fin et de demande initiale d'un titre
    titres = await titresGet()
    const titresDates = await titresDatesUpdate(titres)

    // 7.
    // communes associées aux étapes
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
    // administrations associées aux étapes
    titres = await titresGet()
    const administrations = await administrationsGet()
    const titresEtapesAdministrations = await titresEtapesAdministrationsUpdate(
      titres,
      administrations
    )

    // 9.
    // propriétés des titres
    // en fonction de la chronologie des démarches
    titres = await titresGet()
    const titresPropsEtapeId = await titresPropsEtapeIdUpdate(titres)

    // 10.
    // activités
    // crée les activités manquantes en fonction des titres
    // pour les année 2018 et 2019 (en dur)
    const annees = [2018, 2019]

    titres = await titresGet()
    const activitesTypes = await activitesTypesGet()
    const titresActivites = await titresActivitesTypesUpdate(
      titres,
      activitesTypes,
      annees
    )

    // 11.
    //
    titres = await titresGet()
    const titresPropsActivites = await titresPropsActivitesUpdate(titres)

    // 12.
    // id de titres
    // met à jour les ids de titres, démarches, étapes et sous-éléments
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
    console.log(titresEtapesAdministrations)
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
