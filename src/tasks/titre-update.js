import '../database/index'
import { titreGet } from '../database/queries/titres'

import titresIdsUpdate from './processes/titres-ids-update'

const titreUpdate = async titreId => {
  try {
    // 1.
    // id du titre
    // en fonction du type, du nom et de l'année d'octroi
    const titre = await titreGet(titreId, false)
    const titreIdUpdated = await titresIdsUpdate([titre])

    console.log(titreIdUpdated)

    console.log('Titre mis à jour')
  } catch (e) {
    console.error(`Erreur pendant la mise à jour du titre: ${titreId}`)
    console.error(e)
    throw e
  }
}

export default titreUpdate
