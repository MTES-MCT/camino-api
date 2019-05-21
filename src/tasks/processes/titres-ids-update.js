import titreIdAndRelationsUpdate from '../utils/titre-id-and-relations-update'
import { titreIdUpdate as titreIdUpdateQuery } from '../queries/titres'

const titreIdUpdate = async titresOld => {
  const titresIdsUpdate = await titresOld.reduce(
    async (titresIdsUpdate, titreOld) => {
      try {
        titresIdsUpdate = await titresIdsUpdate

        const titreNew = titreIdAndRelationsUpdate(titreOld)

        if (titreNew.id === titreOld.id) return titresIdsUpdate

        const titreIdUpdate = await titreIdUpdateQuery(titreOld.id, titreNew)

        console.log(titreIdUpdate)

        return [...titresIdsUpdate, titreIdUpdate]
      } catch (e) {
        console.error(titreOld.id)
        console.error(e)

        return titresIdsUpdate
      }
    },
    []
  )

  return `Mise à jour: ${titresIdsUpdate.length} id(s) de titres.`
}

export default titreIdUpdate
