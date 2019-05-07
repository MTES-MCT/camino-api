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
import titresEtapesCommunesUpdate from './processes/titres-etapes-communes-update'
import titresEtapesAdministrationsUpdate from './processes/titres-etapes-administrations-update'
import titresPropsEtapeIdUpdate from './processes/titres-props-etape-id-update'
import titresActivitesTypesUpdate from './processes/titres-activites-update'

import titreIdUpdate from './processes/titre-id-update'

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

    let titresEtapes
    let titresEtapesCommunes
    if (process.env.GEO_API_URL) {
      // 6.
      // communes associées aux étapes
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

    // 7.
    // administrations associées aux étapes
    titresEtapes = await titresEtapesGet()
    const administrations = await administrationsGet()
    const titresEtapesAdministrations = await titresEtapesAdministrationsUpdate(
      titresEtapes,
      administrations
    )

    // 8.
    // propriétés des titres
    // en fonction de la chronologie des démarches
    titres = await titresGet()
    const titresPropsEtapeId = await titresPropsEtapeIdUpdate(titres)

    // 9.
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

    titres = await titresGet()
    const titresIds = await Promise.all(titres.map(titreIdUpdate))

    // logs
    console.log(titresEtapesOrdre)
    console.log(titresDemarchesStatutId)
    console.log(titresDemarchesOrdre)
    console.log(titresStatutIds)
    console.log(titresPhases)
    titresEtapesCommunes.forEach(log => console.log(log))
    console.log(titresEtapesAdministrations)
    console.log(titresPropsEtapeId)
    console.log(titresActivites)
    console.log(titresIds.filter(a => a).join('\n'))

    console.log('Tâches quotidiennes exécutées')
  } catch (e) {
    console.log('Erreur:', e)
  } finally {
    process.exit()
  }
}

run()
