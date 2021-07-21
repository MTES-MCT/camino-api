import { titresTravauGet } from '../database/queries/titres-travaux'
import { userSuper } from '../database/user-super'
import { titresSlugsUpdate } from './processes/titres-slugs-update'
import { titresTravauxEtapesOrdreUpdate } from './processes/titres-travaux-etapes-ordre-update'
import { titresTravauxOrdreUpdate } from './processes/titres-travaux-ordre-update'
import { logsUpdate } from './_logs-update'

const titreTravauxEtapeUpdate = async (titreTravauxId: string) => {
  try {
    console.info()
    console.info('- - -')
    console.info(`mise à jour d'une étape de travaux : ${titreTravauxId}`)

    const titreTravaux = await titresTravauGet(
      titreTravauxId,
      { fields: {} },
      userSuper
    )

    if (!titreTravaux) {
      throw new Error(`les travaux ${titreTravaux} n'existent pas`)
    }

    const titresTravauxEtapesOrdreUpdated =
      await titresTravauxEtapesOrdreUpdate([titreTravauxId])
    const titreId = titreTravaux.titreId
    const titresTravauxOrdreUpdated = await titresTravauxOrdreUpdate([titreId])

    const titresUpdatedIndex = await titresSlugsUpdate([titreId])

    logsUpdate({
      titresTravauxEtapesOrdreUpdated,
      titresTravauxOrdreUpdated,
      titresUpdatedIndex
    })

    return titreId
  } catch (e) {
    console.error(`erreur: titreTravauxEtapeUpdate ${titreTravauxId}`)
    console.error(e)
    throw e
  }
}

export default titreTravauxEtapeUpdate
