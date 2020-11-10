import { titreGet } from '../database/queries/titres'
import titresTravauxOrdreUpdate from './processes/titres-travaux-ordre-update'

const titreTravauxUpdate = async (titreId: string) => {
  try {
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
    console.info('tâches métiers exécutées:')

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
