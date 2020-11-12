import { titreGet } from '../database/queries/titres'
import titresTravauxOrdreUpdate from './processes/titres-travaux-ordre-update'

const titreTravauxUpdate = async (titreId: string) => {
  try {
    console.info()
    console.info('- - -')
    console.info(`mise à jour de travaux : ${titreId}`)
    console.info()

    const titre = await titreGet(
      titreId,
      { fields: { travaux: { etapes: { id: {} } } } },
      'super'
    )

    if (!titre) {
      throw new Error(`warning: le titre ${titreId} n'existe plus`)
    }

    const titresTravauxOrdreUpdated = await titresTravauxOrdreUpdate([titreId])

    console.info()
    console.info('-')
    console.info('tâches exécutées:')

    if (titresTravauxOrdreUpdated.length) {
      console.info(
        `mise à jour: ${titresTravauxOrdreUpdated.length} travaux (ordre)`
      )
    }

    return titre.id
  } catch (e) {
    console.error(`erreur: titreTravauxUpdate ${titreId}`)
    console.error(e)
    throw e
  }
}

export default titreTravauxUpdate
