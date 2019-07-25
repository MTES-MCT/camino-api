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

    console.log('Titre mis à jour')

    return titreGet(titreNew.id)
  } catch (e) {
    console.error(`Erreur pendant la mise à jour du titre: ${titreId}`)
    console.error(e)
    throw e
  }
}

export default titreUpdate
