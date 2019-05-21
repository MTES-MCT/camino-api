import 'dotenv/config'
import '../database/index'

import { entreprisesGet } from '../database/queries/entreprises'
import { entreprisesEtablissementsGet } from '../database/queries/entreprises-etablissements'
import { administrationsGet } from '../database/queries/administrations'
import { departementsGet } from '../database/queries/territoires'

import entreprisesUpdate from './processes/entreprises-update'
import administrationsUpdate from './processes/administrations-update'

const run = async () => {
  try {
    // 1.
    // mise à jour des informations historiques et postales
    // des entreprises et établissements grâce à l'API INSEE

    let entreprisesUpdates
    if (process.env.INSEE_API_URL) {
      const entreprises = await entreprisesGet()
      const entreprisesEtablissements = await entreprisesEtablissementsGet()
      entreprisesUpdates = await entreprisesUpdate(
        entreprises,
        entreprisesEtablissements
      )
    } else {
      entreprisesUpdates = [
        "Connexion à l'API INSEE impossible: variable d'environnement manquante"
      ]
    }

    // 2.
    // mise à jour des administrations grâce à l'API Administration

    let administrationsUpdates

    if (process.env.ADMINISTRATION_API_URL) {
      const departements = await departementsGet()
      const administrations = await administrationsGet()
      administrationsUpdates = await administrationsUpdate(
        administrations,
        departements
      )
    } else {
      administrationsUpdates =
        "Connexion à l'API Administration impossible: variable d'environnement manquante"
    }

    // logs
    console.log(entreprisesUpdates.join('\n'))
    console.log(administrationsUpdates)

    console.log('Tâches mensuelles exécutées')
  } catch (e) {
    console.log('Erreur:', e)
  } finally {
    process.exit()
  }
}

run()
