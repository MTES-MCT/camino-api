import titreDemarchesAscSort from '../utils/titre-demarches-asc-sort'
import titreDemarchesByTypeUpdate from '../utils/titre-demarches-by-type-update'
import { titreDemarchesIdsUpdate } from '../queries/titre-demarches'

// si le type d'une démarche change
// ou si l'ordre est 00 (ajout d'une nouvelle démarche)
// - met à jour l'id de la démarche et ses étapes

const titreDemarchesIdUpdate = async (titreDemarche, titre) => {
  const { id: titreDemarcheOldId, titreDemarcheId } = titreDemarche

  const titreDemarcheTypeOldId = titreDemarcheOldId.slice(-5, -2)
  const titreDemarcheTypeNewId = titreDemarche.typeId

  if (titreDemarcheTypeOldId === titreDemarcheTypeNewId) {
    return 'Mise à jour: 0 id de démarches.'
  }

  // les démarches de l'ancien type de la démarche dans l'ordre asc
  const titreDemarchesByTypeOld = titreDemarchesAscSort(
    titre.demarches.filter(te => te.typeId === titreDemarcheTypeOldId)
  )

  // les démarches du nouveau type que la démarche dans l'ordre asc
  const titreDemarchesByTypeNew = titreDemarchesAscSort(
    titre.demarches.filter(te => te.typeId === titreDemarcheTypeNewId)
  )

  const { titreDemarchesOldIds, titreDemarchesNew } = [
    titreDemarchesByTypeOld,
    titreDemarchesByTypeNew
  ].reduce(
    (acc, titreDemarches) => {
      if (!titreDemarches.length) return acc

      const {
        titreDemarchesOldIds,
        titreDemarchesNew
      } = titreDemarchesByTypeUpdate(titreDemarches, titre)

      return {
        titreDemarchesOldIds: [
          ...acc.titreDemarchesOldIds,
          ...titreDemarchesOldIds
        ],
        titreDemarchesNew: [...acc.titreDemarchesNew, ...titreDemarchesNew]
      }
    },
    { titreDemarchesOldIds: [], titreDemarchesNew: [] }
  )

  if (titreDemarchesNew.length) {
    await titreDemarchesIdsUpdate(titreDemarchesOldIds, titreDemarchesNew)
  }

  return `Mise à jour: ${titreDemarchesNew.length} id de démarches.`
}

export default titreDemarchesIdUpdate
