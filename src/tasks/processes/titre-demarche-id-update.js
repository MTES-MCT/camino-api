import titreDemarchesAscSort from '../utils/titre-demarches-asc-sort'
import titreDemarchesByTypeUpdate from '../utils/titre-demarches-by-type-update'
import titresPhasesUpdate from './titres-phases-update'
import { titreDemarchesIdsUpdate } from '../queries/titre-demarches'

// si le type d'une démarche change
// ou si l'ordre est 00 (ajout d'une nouvelle démarche)
// - met à jour l'id de la démarche
// - met à jour l'id des tables liées (colonnes id et titreDemarcheId)

const titreDemarchesIdUpdate = async (titreDemarche, titre) => {
  const { id: titreDemarcheOldId, titreDemarcheId } = titreDemarche

  const titreDemarcheTypeOldId = titreDemarcheOldId.slice(-5, -2)
  const titreDemarcheTypeNewId = titreDemarche.typeId

  if (titreDemarcheTypeOldId === titreDemarcheTypeNewId) {
    return [
      'Mise à jour: 0 id de démarches.',
      'Mise à jour: 0 phases de titres.'
    ]
  }

  // les démarches de l'ancien type de la démarche dans l'ordre asc
  const titreDemarchesByTypeOld = titreDemarchesAscSort(
    titre.demarches.filter(te => te.typeId === titreDemarcheTypeOldId)
  )

  // les démarches du nouveau type que la démarche dans l'ordre asc
  const titreDemarchesByTypeNew = titreDemarchesAscSort(
    titre.demarches.filter(te => te.typeId === titreDemarcheTypeNewId)
  )

  const { titreDemarchesOldIds, titreDemarchesNew, titrePhases } = [
    titreDemarchesByTypeOld,
    titreDemarchesByTypeNew
  ].reduce(
    (acc, titreDemarches) => {
      if (!titreDemarches.length) return acc

      const {
        titreDemarchesOldIds,
        titreDemarchesNew,
        titrePhases
      } = titreDemarchesByTypeUpdate(titreDemarches, titre)

      return {
        titreDemarchesOldIds: [
          ...acc.titreDemarchesOldIds,
          ...titreDemarchesOldIds
        ],
        titreDemarchesNew: [...acc.titreDemarchesNew, ...titreDemarchesNew],
        titrePhases: [...acc.titrePhases, ...titrePhases]
      }
    },
    { titreDemarchesOldIds: [], titreDemarchesNew: [], titrePhases: [] }
  )

  if (titreDemarchesNew.length) {
    await titreDemarchesIdsUpdate(titreDemarchesOldIds, titreDemarchesNew)
  }

  let titrePhasesUpdated = []
  if (titrePhases.length > 0) {
    titrePhasesUpdated = await titresPhasesUpdate([
      { demarches: [titreDemarche], phases: titrePhases }
    ])
  }

  return [
    `Mise à jour: ${titreDemarchesNew.length} id de démarches.`,
    titrePhasesUpdated
  ]
}

export default titreDemarchesIdUpdate
