import 'dotenv/config'
import '../database/index'

import { entreprisesGet } from '../database/queries/entreprises'

import entreprisesUpdate from './processes/entreprises-update'

const run = async () => {
  try {
    // 1.
    // mise à jour des informations historiques et postales
    // des entreprises et établissements grâce à l'API INSEE

    const entreprises = await entreprisesGet()
    const entreprisesUpdates = await entreprisesUpdate(entreprises)

    // logs
    entreprisesUpdates.forEach(u => console.log(u))

    console.log('Tâches mensuelles exécutées')
  } catch (e) {
    console.log('Erreur:', e)
  } finally {
    process.exit()
  }
}

run()
