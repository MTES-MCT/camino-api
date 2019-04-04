import titreEtapesAscSort from '../utils/titre-etapes-asc-sort'
import titreEtapesByTypeUpdate from '../utils/titre-etapes-by-type-update'
import { titrePropsUpdate } from '../queries/titres'
import { titreEtapesIdsUpdate } from '../queries/titre-etapes'

// si le type d'une étape change
// ou si l'ordre est 00 (ajout d'une nouvelle étape)
// - met à jour l'id de l'étape
// - met à jour l'id des tables liées (colonnes id et titreEtapeId)

// si des props du titre pointent vers l'étape:
// - met à jour le titreEtapeId des props

// const props = [
// DOCUMENTS
//   ['points', 'pointsReferences'],
//   'documents',
// JOINTURES
//   'substances',
//   'titulaires',
//   'amodiataires',
//   'administrations',
//   'communes',
//   'emprises'
// ]

const titreEtapesIdUpdate = async (titreEtape, titre) => {
  const { id: titreEtapeOldId, titreDemarcheId } = titreEtape

  const titreDemarche = titre.demarches.find(t => t.id === titreDemarcheId)

  const titreEtapeTypeOldId = titreEtapeOldId.slice(-5, -2)
  const titreEtapeTypeNewId = titreEtape.typeId

  if (titreEtapeTypeOldId === titreEtapeTypeNewId) {
    return [
      `Mise à jour: 0 id d'étapes.`,
      `Mise à jour: 0 propriétés de titres.`
    ]
  }

  // les étapes de l'ancien type de l'étape dans l'ordre asc
  const titreEtapesByTypeOld = titreEtapesAscSort(
    titreDemarche.etapes.filter(te => te.typeId === titreEtapeTypeOldId)
  )

  // les étapes du nouveau type que l'étape dans l'ordre asc
  const titreEtapesByTypeNew = titreEtapesAscSort(
    titreDemarche.etapes.filter(te => te.typeId === titreEtapeTypeNewId)
  )

  const { titreEtapesOldIds, titreEtapesNew, titreProps } = [
    titreEtapesByTypeOld,
    titreEtapesByTypeNew
  ].reduce(
    (acc, titreEtapes) => {
      if (!titreEtapes.length) return acc

      const {
        titreEtapesOldIds,
        titreEtapesNew,
        titreProps
      } = titreEtapesByTypeUpdate(titreEtapes, titre)

      return {
        titreEtapesOldIds: [...acc.titreEtapesOldIds, ...titreEtapesOldIds],
        titreEtapesNew: [...acc.titreEtapesNew, ...titreEtapesNew],
        titreProps: { ...acc.titreProps, ...titreProps }
      }
    },
    { titreEtapesOldIds: [], titreEtapesNew: [], titreProps: {} }
  )

  if (titreEtapesNew.length) {
    await titreEtapesIdsUpdate(titreEtapesOldIds, titreEtapesNew)
  }

  const titrePropsKeys = Object.keys(titreProps)
  if (titrePropsKeys.length > 0) {
    await Promise.all(titrePropsKeys.map(prop => titrePropsUpdate(titre, prop)))
  }

  return [
    `Mise à jour: ${titreEtapesNew.length} id d'étapes.`,
    `Mise à jour: ${titrePropsKeys.length} propriétés de titres.`
  ]
}

export default titreEtapesIdUpdate
