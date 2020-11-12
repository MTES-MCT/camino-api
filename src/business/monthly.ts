import administrationsUpdate from './processes/administrations-update'
import entreprisesUpdate from './processes/entreprises-update'
import updatesLog from './_updates-log'

const monthly = async () => {
  try {
    console.info()
    console.info('- - -')
    console.info('mise à jour mensuelle')

    // 1.
    const {
      entreprisesUpdated = [],
      etablissementsUpdated = [],
      etablissementsDeleted = []
    } = await entreprisesUpdate()

    // 2.
    // mise à jour des administrations grâce à l'API Administration
    const administrationsUpdated = await administrationsUpdate()

    updatesLog({
      entreprisesUpdated,
      etablissementsUpdated,
      etablissementsDeleted,
      administrationsUpdated
    })
  } catch (e) {
    console.info('erreur:', e)

    throw e
  }
}

export default monthly
