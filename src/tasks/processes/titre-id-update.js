import titreIdAndRelationsUpdate from '../utils/titre-id-and-relations-update'
import { titreIdsUpdate } from '../queries/titres'

const titreIdUpdate = async titreOld => {
  const { titreNew, hasChanged } = titreIdAndRelationsUpdate(titreOld)
  if (!hasChanged) return titreOld

  const titreIdUpdate = await titreIdsUpdate(titreOld.id, titreNew)

  console.log(titreIdUpdate)

  return titreNew
}

export default titreIdUpdate
