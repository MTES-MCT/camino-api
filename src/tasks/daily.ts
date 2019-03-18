import 'dotenv/config'
import '../database/index'

import { titresGet } from '../database/queries/titres'
import { titresDemarchesGet } from '../database/queries/titres-demarches'
import { titresEtapesGet } from '../database/queries/titres-etapes'
import { communesGet } from '../database/queries/communes'
import { activitesTypesGet } from '../database/queries/metas'

import titresEtapesOrdreUpdate from './processes/titres-etapes-ordre-update'
import titresDemarchesStatutIdUpdate from './processes/titres-demarches-statut-ids-update'
import titresDemarchesOrdreUpdate from './processes/titres-demarches-ordre-update'
import titresStatutIdsUpdate from './processes/titres-statut-ids-update'
import titresPhasesUpdate from './processes/titres-phases-update'
import titresEtapesCommunesUpdate from './processes/titres-etapes-communes-update'
import titresPropsEtapeIdUpdate from './processes/titres-props-etape-id-update'
import titresActivitesTypesUpdate from './processes/titres-activites-update'

const run = async () => {
  try {
    // 1.
    // ordre des étapes
    // en fonction de leur date
    let titresDemarches = await titresDemarchesGet({
      demarchesIds: undefined,
      titresIds: undefined
    })
    const titresEtapesOrdre = await titresEtapesOrdreUpdate(titresDemarches)

    // 2.
    // statut des démarches
    // en fonction de ses étapes (type, ordre, statut)
    let titres = await titresGet({
      typeIds: undefined,
      domaineIds: undefined,
      statutIds: undefined,
      substances: undefined,
      noms: undefined,
      entreprises: undefined,
      references: undefined,
      territoires: undefined
    })
    const titresDemarchesStatutId = await titresDemarchesStatutIdUpdate(titres)

    // 3.
    // détermine l'ordre des démarche
    // en fonction de la date de leur première étape
    titres = await titresGet({
      typeIds: undefined,
      domaineIds: undefined,
      statutIds: undefined,
      substances: undefined,
      noms: undefined,
      entreprises: undefined,
      references: undefined,
      territoires: undefined
    })
    const titresDemarchesOrdre = await titresDemarchesOrdreUpdate(titres)

    // 4.
    // statut des titres
    // en fonction des démarches et de la date du jour
    titres = await titresGet({
      typeIds: undefined,
      domaineIds: undefined,
      statutIds: undefined,
      substances: undefined,
      noms: undefined,
      entreprises: undefined,
      references: undefined,
      territoires: undefined
    })
    const titresStatutIds = await titresStatutIdsUpdate(titres)

    // 5.
    // phases des titres
    // en fonction des démarches et de la date du jour
    titres = await titresGet({
      typeIds: undefined,
      domaineIds: undefined,
      statutIds: undefined,
      substances: undefined,
      noms: undefined,
      entreprises: undefined,
      references: undefined,
      territoires: undefined
    })
    const titresPhases = await titresPhasesUpdate(titres)

    // 6.
    // communes associées aux étapes
    const titresEtapes = await titresEtapesGet({
      etapesIds: undefined,
      etapesTypeIds: undefined,
      titresDemarchesIds: undefined
    })
    const communes = await communesGet()
    const titresEtapesCommunes = await titresEtapesCommunesUpdate(
      titresEtapes,
      communes
    )

    // 7.
    // propriétés des titres
    // en fonction de la chronologie des démarches
    titres = await titresGet({
      typeIds: undefined,
      domaineIds: undefined,
      statutIds: undefined,
      substances: undefined,
      noms: undefined,
      entreprises: undefined,
      references: undefined,
      territoires: undefined
    })
    const titresPropsEtapeId = await titresPropsEtapeIdUpdate(titres)

    // 8.
    // activités
    // crée les activités manquantes en fonction des titres
    // pour l'année 2018 (en dur)
    const annees = [2018]

    titres = await titresGet()
    const activitesTypes = await activitesTypesGet()
    const titresActivites = await titresActivitesTypesUpdate(
      titres,
      activitesTypes,
      annees
    )

    // logs
    console.log(titresEtapesOrdre)
    console.log(titresDemarchesStatutId)
    console.log(titresDemarchesOrdre)
    console.log(titresStatutIds)
    console.log(titresPhases)
    titresEtapesCommunes.forEach(log => {
      console.log(log)
    })
    console.log(titresPropsEtapeId)
    console.log(titresActivites)

    console.log('Tâches quotidiennes executées')
  } catch (e) {
    console.log('Erreur:', e)
  } finally {
    process.exit()
  }
}

run()
