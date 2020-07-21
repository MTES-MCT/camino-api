import 'dotenv/config'
import '../init'

import { administrationsGet } from '../database/queries/administrations'
import { entreprisesGet } from '../database/queries/entreprises'
import { entreprisesEtablissementsGet } from '../database/queries/entreprises-etablissements'
import { departementsGet } from '../database/queries/territoires'

import administrationsUpdate from './processes/administrations-update'
import entreprisesUpdate from './processes/entreprises-update'

const run = async () => {
  try {
    // 1.
    console.info()
    console.info('entreprises (API INSEE)…')

    const entreprises = await entreprisesGet({}, {}, 'super')
    const entreprisesEtablissements = await entreprisesEtablissementsGet()

    const [
      entreprisesUpdated = [],
      etablissementsUpdated = [],
      etablissementsDeleted = []
    ] = await entreprisesUpdate(entreprises, entreprisesEtablissements)

    // 2.
    // mise à jour des administrations grâce à l'API Administration

    const departements = await departementsGet()
    const administrations = await administrationsGet({}, {}, 'super')
    const administrationsUpdated = await administrationsUpdate(
      administrations,
      departements
    )

    console.info()
    console.info('tâches mensuelles exécutées:')

    if (entreprisesUpdated.length) {
      console.info(
        `mise à jour: ${entreprisesUpdated.length} adresse(s) d'entreprise(s)`
      )
    }

    if (etablissementsUpdated.length) {
      console.info(
        `mise à jour: ${etablissementsUpdated.length} établissement(s) d'entreprise(s)`
      )
    }

    if (etablissementsDeleted.length) {
      console.info(
        `suppression: ${etablissementsDeleted.length} établissement(s) d'entreprise(s)`
      )
    }

    if (administrationsUpdated.length) {
      console.info(
        `mise à jour: ${administrationsUpdated.length} administration(s)`
      )
    }
  } catch (e) {
    console.info('erreur:', e)
  } finally {
    process.exit()
  }
}

run()
