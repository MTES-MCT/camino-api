import { titreGet } from '../database/queries/titres'
import { userSuper } from '../database/user-super'
import { titresSlugsUpdate } from './processes/titres-slugs-update'
import { titresTravauxOrdreUpdate } from './processes/titres-travaux-ordre-update'
import { logsUpdate } from './_logs-update'

const titreTravauxUpdate = async (titreId: string) => {
  try {
    console.info()
    console.info('- - -')
    console.info(`mise à jour de travaux : ${titreId}`)
    console.info()

    const titre = await titreGet(titreId, { fields: {} }, userSuper)

    if (!titre) {
      throw new Error(`warning: le titre ${titreId} n'existe plus`)
    }

    const titresTravauxOrdreUpdated = await titresTravauxOrdreUpdate([titreId])
    const titresUpdatedIndex = await titresSlugsUpdate([titreId])

    console.info()
    console.info('-')
    console.info('tâches exécutées:')

    logsUpdate({
      titresTravauxOrdreUpdated,
      titresUpdatedIndex
    })

    return titre.id
  } catch (e) {
    console.error(`erreur: titreTravauxUpdate ${titreId}`)
    console.error(e)
    throw e
  }
}

export default titreTravauxUpdate
