import titreEtapesAscSort from '../utils/titre-etapes-asc-sort'
import {
  titrePropsUpdate,
  calculatedProps as titreCalculatedProps
} from '../queries/titres'
import { titreEtapesUpdateAll } from '../queries/titre-etapes'

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

const titreEtapesProps = [['points', 'references'], 'documents']

const titreCalculatedPropsUpdate = (titre, titreEtapeIdNew, titreEtapeIdOld) =>
  titreCalculatedProps.reduce((acc, prop) => {
    const titreProp = titre[`${prop}TitreEtapeId`]

    return titreProp === titreEtapeIdOld
      ? { ...acc, [prop]: titreEtapeIdNew }
      : acc
  }, {})

const titreEtapePropUpdate = (
  elements,
  titreEtapeIdNew,
  titreEtapeIdOld,
  prop,
  elementIdProp
) => {
  if (!Array.isArray(elements)) {
    elements = [elements]
  }

  elements.forEach(element => {
    const elementIdMatch = element.id && element.id.match(titreEtapeIdOld)
    const elementTitreEtapeIdOldMatch =
      element[elementIdProp] && element[elementIdProp].match(titreEtapeIdOld)

    if (!elementIdMatch || !elementTitreEtapeIdOldMatch) {
      return
    }

    if (elementIdMatch) {
      const elementIdOld = element.id
      const elementIdNew = elementIdOld.replace(
        titreEtapeIdOld,
        titreEtapeIdNew
      )

      element.id = elementIdNew
    }

    if (elementTitreEtapeIdOldMatch) {
      element[elementIdProp] = titreEtapeIdNew
    }
  })
}

const titreEtapePropsUpdate = (
  titreEtapeNew,
  titreEtapeIdNew,
  titreEtapeIdOld,
  titreEtapesProps,
  titreEtapeIdProp
) => {
  titreEtapesProps.forEach(prop => {
    if (Array.isArray(prop)) {
      const elements = titreEtapeNew[prop[0]]

      titreEtapePropUpdate(
        elements,
        titreEtapeIdNew,
        titreEtapeIdOld,
        prop[0],
        titreEtapeIdProp
      )

      elements.forEach(element => {
        titreEtapePropsUpdate(
          element,
          titreEtapeIdNew,
          titreEtapeIdOld,
          prop.slice(1),
          'titrePointId'
        )
      })

      return
    }

    titreEtapePropUpdate(
      titreEtapeNew[prop],
      titreEtapeIdNew,
      titreEtapeIdOld,
      prop,
      titreEtapeIdProp
    )
  })
}

const titreEtapeCopy = (titreEtapeOld, titre, i) => {
  const { id: titreEtapeIdOld } = titreEtapeOld

  const titreEtapeTypeId = titreEtapeIdOld.slice(-5, -2)
  const titreEtapeOrder = titreEtapeIdOld.slice(-2)

  const titreEtapeOrderString = (i + 1).toString().padStart(2, '0')

  if (
    // si le type d'une étape n'a pas changé
    titreEtapeTypeId === titreEtapeOld.typeId &&
    // et si l'ordre n'a pas changé
    titreEtapeOrder === titreEtapeOrderString
  ) {
    return {}
  }

  // fait une copie de l'étape
  const titreEtapeNew = titreEtapeOld

  // suppression des propriétés de points
  delete titreEtapeNew.geojsonMultiPolygon
  delete titreEtapeNew.geojsonPoints

  // - change l'id de la nouvelle étape
  const titreEtapeIdNew = `${titreEtapeOld.titreDemarcheId}-${
    titreEtapeOld.typeId
  }${titreEtapeOrderString}`

  titreEtapeNew.id = titreEtapeIdNew

  // - const props = propriétés du titre qui pointent vers l'ancienne étape
  const titreProps = titreCalculatedPropsUpdate(
    titre,
    titreEtapeIdNew,
    titreEtapeIdOld
  )

  // - change l'id des tables liées (id de la ligne si basé sur l'id de l'étape)
  titreEtapePropsUpdate(
    titreEtapeNew,
    titreEtapeIdNew,
    titreEtapeIdOld,
    titreEtapesProps,
    'titreEtapeId'
  )

  return { titreProps, titreEtapeNew }
}

const titreEtapesIdUpdate = async (titreEtape, titre) => {
  const { id: titreEtapeIdOld, titreDemarcheId } = titreEtape

  const titreDemarche = titre.demarches.find(t => t.id === titreDemarcheId)

  const titreEtapeTypeIdOld = titreEtapeIdOld.slice(-5, -2)
  const titreEtapeTypeIdNew = titreEtape.typeId

  // les étapes de l'ancien type de l'étape dans l'ordre asc
  const titreEtapesTypeIdOld = titreEtapesAscSort(
    titreDemarche.etapes.filter(te => te.typeId === titreEtapeTypeIdOld)
  )
  // les étapes de même type aue l'étape dans l'ordre asc
  const titreEtapesTypeIdNew = titreEtapesAscSort(
    titreDemarche.etapes.filter(te => te.typeId === titreEtapeTypeIdNew)
  )

  const { titreEtapesIdsOld, titreEtapesNew, titreProps } = [
    titreEtapesTypeIdOld,
    titreEtapesTypeIdNew
  ].reduce(
    (acc, titreEtapes) => {
      const {
        titreEtapesIdsOld,
        titreEtapesNew,
        titreProps
      } = titreEtapes.reduce(
        (acc, titreEtapeOld, i) => {
          const { id: titreEtapeOldId } = titreEtapeOld

          const { titreEtapeNew, titreProps } = titreEtapeCopy(
            titreEtapeOld,
            titre,
            i
          )

          return titreEtapeNew
            ? {
                titreEtapesIdsOld: [...acc.titreEtapesIdsOld, titreEtapeOldId],
                titreEtapesNew: [...acc.titreEtapesNew, titreEtapeNew],
                titreProps: { ...acc.titreProps, ...titreProps }
              }
            : acc
        },
        { titreEtapesIdsOld: [], titreEtapesNew: [], titreProps: {} }
      )

      return {
        titreEtapesIdsOld: [...acc.titreEtapesIdsOld, ...titreEtapesIdsOld],
        titreEtapesNew: [...acc.titreEtapesNew, ...titreEtapesNew],
        titreProps: { ...acc.titreProps, ...titreProps }
      }
    },
    { titreEtapesIdsOld: [], titreEtapesNew: [], titreProps: {} }
  )

  if (titreEtapesNew.length) {
    console.log('updateall')
    console.log(JSON.stringify(titreEtapesNew))

    await titreEtapesUpdateAll(titreEtapesIdsOld, titreEtapesNew)
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
