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

    const entreprises = await entreprisesGet()
    const entreprisesEtablissements = await entreprisesEtablissementsGet()
    const entreprisesUpdates = await entreprisesUpdate(
      entreprises,
      entreprisesEtablissements
    )

    // 2.
    // mise à jour des administrations grâce à l'API Administration

    const departements = await departementsGet()
    const administrations = await administrationsGet()
    const administrationsUpdates = await administrationsUpdate(
      administrations,
      departements
    )

    // logs
    entreprisesUpdates.forEach(u => console.log(u))
    console.log(administrationsUpdates)

    console.log('Tâches mensuelles exécutées')
  } catch (e) {
    console.log('Erreur:', e)
  } finally {
    process.exit()
  }
}

run()
