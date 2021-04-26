import { administrationsUpdate } from './processes/administrations-update'
import { entreprisesUpdate } from './processes/entreprises-update'
import { titresEtapesAreasUpdate } from './processes/titres-etapes-areas-update'
import { logsUpdate } from './_logs-update'

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

    // 3.
    // mise à jour des forêts et des communes
    const { titresCommunes, titresForets } = await titresEtapesAreasUpdate()
    const {
      areasUpdated: communesUpdated = [],
      titresEtapesAreasUpdated: titresEtapesCommunesUpdated = [],
      titresEtapesAreasDeleted: titresEtapesCommunesDeleted = []
    } = titresCommunes
    const {
      areasUpdated: foretsUpdated = [],
      titresEtapesAreasUpdated: titresEtapesForetsUpdated = [],
      titresEtapesAreasDeleted: titresEtapesForetsDeleted = []
    } = titresForets

    logsUpdate({
      entreprisesUpdated,
      etablissementsUpdated,
      etablissementsDeleted,
      administrationsUpdated,
      communesUpdated,
      titresEtapesCommunesUpdated,
      titresEtapesCommunesDeleted,
      foretsUpdated,
      titresEtapesForetsUpdated,
      titresEtapesForetsDeleted
    })
  } catch (e) {
    console.info('erreur:', e)

    throw e
  }
}

export default monthly
