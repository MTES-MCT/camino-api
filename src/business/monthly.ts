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
    console.log()
    console.log('entreprises (API INSEE)…')

    const entreprises = await entreprisesGet()
    const entreprisesEtablissements = await entreprisesEtablissementsGet()

    const [
      entreprisesUpdated = [],
      etablissementsUpdated = [],
      etablissementsDeleted = []
    ] = await entreprisesUpdate(entreprises, entreprisesEtablissements)

    // 2.
    // mise à jour des administrations grâce à l'API Administration

    const departements = await departementsGet()
    const administrations = await administrationsGet()
    const administrationsUpdated = await administrationsUpdate(
      administrations,
      departements
    )

    console.log()
    console.log('tâches mensuelles exécutées:')

    console.log(
      `mise à jour: ${entreprisesUpdated.length} adresse(s) d'entreprise(s)`
    )
    console.log(
      `mise à jour: ${etablissementsUpdated.length} établissement(s) d'entreprise(s)`
    )
    console.log(
      `suppression: ${etablissementsDeleted.length} établissement(s) d'entreprise(s)`
    )
    console.log(
      `mise à jour: ${administrationsUpdated.length} administration(s)`
    )
  } catch (e) {
    console.log('erreur:', e)
  } finally {
    process.exit()
  }
}

run()
