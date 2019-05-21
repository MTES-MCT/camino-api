import titreIdAndRelationsUpdate from '../utils/titre-id-and-relations-update'
import { titreIdUpdate as titreIdUpdateQuery } from '../queries/titres'

const titreIdUpdate = async titreOld => {
  const titreNew = titreIdAndRelationsUpdate(titreOld)
  if (titreNew.id === titreOld.id) return titreOld

  const titreIdUpdate = await titreIdUpdateQuery(titreOld.id, titreNew)

  console.log(titreIdUpdate)

  return titreNew
}

export default titreIdUpdate
