import 'dotenv/config'
import '../database/index'

import { administrationsGet } from '../database/queries/administrations'
import { entreprisesGet } from '../database/queries/entreprises'
import { entreprisesEtablissementsGet } from '../database/queries/entreprises-etablissements'
import { departementsGet } from '../database/queries/territoires'

import administrationsUpdate from './processes/administrations-update'
import entreprisesUpdate from './processes/entreprises-update'

const run = async () => {
  try {
    // 1.
    console.log('\nentreprises (API INSEE)…')
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
        "API INSEE: connexion impossible car la variable d'environnement est absente"
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
        "API Administration: connexion impossible car la variable d'environnement est absente"
    }

    console.log('\ntâches mensuelles exécutées:')
    console.log(entreprisesUpdates.join('\n'))
    console.log(administrationsUpdates)
  } catch (e) {
    console.log('erreur:', e)
  } finally {
    process.exit()
  }
}

run()
