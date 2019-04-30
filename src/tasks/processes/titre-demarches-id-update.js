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

  const titreDemarcheOldTypeId = titreDemarcheOldId.slice(-5, -2)
  const titreDemarcheTypeId = titreDemarche.typeId

  // un tableau contenant les liste de démarches modifiées
  // une seule liste de démarches si le type n'a pas changé
  // sinon, une liste de démarche de chaque type
  const titreDemarchesByTypes =
    titreDemarcheOldTypeId === titreDemarcheTypeId
      ? [titre.demarches.filter(te => te.typeId === titreDemarcheTypeId)]
      : [
          titre.demarches.filter(te => te.typeId === titreDemarcheTypeId),
          titre.demarches.filter(te => te.typeId === titreDemarcheOldTypeId)
        ]

  const {
    titreDemarchesOldIds,
    titreDemarchesNew,
    titreProps
  } = titreDemarchesByTypes.reduce(
    (acc, titreDemarchesByType) => {
      if (!titreDemarchesByType.length) return acc

      const {
        titreDemarchesOldIds,
        titreDemarchesNew,
        titreProps
      } = titreDemarchesByTypeUpdate(
        titreDemarchesAscSort(titreDemarchesByType),
        titre
      )

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
