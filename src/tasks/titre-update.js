import '../database/index'
import { titreGet } from '../database/queries/titres'

import titreIdUpdate from './processes/titre-id-update'

const titreUpdate = async titreId => {
  // 1.
  // id du titre
  // en fonction du type, du nom et de l'année d'octroi
  const titre = await titreGet(titreId)
  const titreIdUpdated = await titreIdUpdate(titre)

  console.log(titreIdUpdated)

  console.log('Titre mis à jour')
}

export default titreUpdate
