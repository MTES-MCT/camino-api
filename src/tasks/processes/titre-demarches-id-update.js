import titreDemarchesAscSort from '../utils/titre-demarches-asc-sort'
import titreDemarchesByTypeUpdate from '../utils/titre-demarches-by-type-update'
import { titrePropsUpdate } from '../queries/titres'
import { titreDemarchesIdsUpdate } from '../queries/titre-demarches'

// si le type d'une démarche change
// ou si l'ordre est 00 (ajout d'une nouvelle démarche)
// - met à jour l'id de la démarche et ses étapes

// si des props du titre pointent vers les étapes mise à jour:
// - met à jour le titreEtapeId des props

const titreDemarchesIdUpdate = async (titreDemarche, titre) => {
  const { id: titreDemarcheOldId } = titreDemarche

  const titreDemarcheTypeOldId = titreDemarcheOldId.slice(-5, -2)
  const titreDemarcheTypeNewId = titreDemarche.typeId

  // problème: si l'ordre de démarches de même type change
  // il faut changer les ids
  // ça n'est pas pris en compte actuellement
  if (titreDemarcheTypeOldId === titreDemarcheTypeNewId) {
    return [
      'Mise à jour: 0 id de démarches.',
      'Mise à jour: 0 propriétés de titres.'
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

  const { titreDemarchesOldIds, titreDemarchesNew, titreProps } = [
    titreDemarchesByTypeOld,
    titreDemarchesByTypeNew
  ].reduce(
    (acc, titreDemarches) => {
      if (!titreDemarches.length) return acc

      const {
        titreDemarchesOldIds,
        titreDemarchesNew,
        titreProps
      } = titreDemarchesByTypeUpdate(titreDemarches, titre)

      return {
        titreDemarchesOldIds: [
          ...acc.titreDemarchesOldIds,
          ...titreDemarchesOldIds
        ],
        titreDemarchesNew: [...acc.titreDemarchesNew, ...titreDemarchesNew],
        titreProps: { ...acc.titreProps, ...titreProps }
      }
    },
    { titreDemarchesOldIds: [], titreDemarchesNew: [], titreProps: {} }
  )

  if (titreDemarchesNew.length) {
    await titreDemarchesIdsUpdate(titreDemarchesOldIds, titreDemarchesNew)
  }

  const titrePropsKeys = Object.keys(titreProps)
  if (titrePropsKeys.length > 0) {
    await Promise.all(titrePropsKeys.map(prop => titrePropsUpdate(titre, prop)))
  }

  return [
    `Mise à jour: ${titreDemarchesNew.length} id de démarches.`,
    `Mise à jour: ${titrePropsKeys.length} propriétés de titres.`
  ]
}

export default titreDemarchesIdUpdate
