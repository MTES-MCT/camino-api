import '../database/index'
import { titreGet } from '../database/queries/titres'

import { titreIdsUpdate } from './processes/titres-ids-update'

const titreUpdate = async titreId => {
  try {
    // 1.
    // id du titre
    // en fonction du type, du nom et de l'année d'octroi
    const titre = await titreGet(titreId, { format: false })
    const titreNew = await titreIdsUpdate(titre)

    return titreGet(titreNew.id)
  } catch (e) {
    console.error(`erreur: titreUpdate ${titreId}`)
    console.error(e)
    throw e
  }
}

export default titreUpdate
