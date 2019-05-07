import slugify from '@sindresorhus/slugify'
import titreIdAndRelationsUpdate from '../utils/titre-id-and-relations-update'
import { titreIdUpdate as titreIdUpdateQuery } from '../queries/titres'

const titreIdUpdate = async titresOld => {
  const titresIdsUpdate = titresOld.reduce((titresIdsUpdate, titreOld) => {
    const titreNew = titreIdAndRelationsUpdate(titreOld)

    return titreNew.id !== titreOld.id
      ? [...titresIdsUpdate, titreIdUpdateQuery(titreOld.id, titreNew)]
      : titresIdsUpdate
  }, [])

  await Promise.all(titresIdsUpdate)

  return `Mise à jour: ${titresIdsUpdate.length} id(s) de titres.`
}

export default titreIdUpdate
