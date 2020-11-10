import administrationsUpdate from './processes/administrations-update'
import entreprisesUpdate from './processes/entreprises-update'

const monthly = async () => {
  try {
    // 1.
    console.info()

    const [
      entreprisesUpdated = [],
      etablissementsUpdated = [],
      etablissementsDeleted = []
    ] = await entreprisesUpdate()

    // 2.
    // mise à jour des administrations grâce à l'API Administration
    const administrationsUpdated = await administrationsUpdate()

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

export default monthly
