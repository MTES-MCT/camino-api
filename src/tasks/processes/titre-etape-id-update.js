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

const titreEtapesProps = [
  {
    name: 'points',
    elementIdProp: 'titreEtapeId',
    children: [
      {
        name: 'references',
        elementIdProp: 'titrePointId'
      }
    ]
  },
  {
    name: 'documents',
    elementIdProp: 'titreEtapeId'
  }
]

const titreCalculatedPropsUpdate = (
  titre,
  titreEtapeIdNew,
  titreEtapeIdOld,
  titreCalculatedProps
) =>
  titreCalculatedProps.reduce((acc, prop) => {
    const titreProp = titre[`${prop}TitreEtapeId`]

    return titreProp === titreEtapeIdOld
      ? { ...acc, [prop]: titreEtapeIdNew }
      : acc
  }, {})

const elementChildrenPropUpdate = (
  elements,
  titreEtapeIdNew,
  titreEtapeIdOld,
  elementIdProp
) => {
  elements.forEach(element => {
    if (element.id && element.id.match(titreEtapeIdOld)) {
      element.id = element.id.replace(titreEtapeIdOld, titreEtapeIdNew)
    }

    if (
      element[elementIdProp] &&
      element[elementIdProp].match(titreEtapeIdOld)
    ) {
      element[elementIdProp] = titreEtapeIdNew
    }
  })
}

const elementChildrenPropsUpdate = (
  titreEtapeNew,
  titreEtapeIdNew,
  titreEtapeIdOld,
  titreEtapesProps
) => {
  titreEtapesProps.forEach(prop => {
    const elements = titreEtapeNew[prop.name]
    if (!elements) return

    if (prop.children) {
      elements.forEach(element => {
        elementChildrenPropsUpdate(
          element,
          titreEtapeIdNew,
          titreEtapeIdOld,
          prop.children
        )
      })
    }

    elementChildrenPropUpdate(
      elements,
      titreEtapeIdNew,
      titreEtapeIdOld,
      prop.elementIdProp
    )
  })
}

const titreEtapeIdUpdate = (titreEtapeOld, titre, i) => {
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

  // utilise la référence à l'étape liée à la référence du titre
  // pour la mise à jour
  const titreEtapeNew = titreEtapeOld

  // supprime des propriétés de points
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
    titreEtapeIdOld,
    titreCalculatedProps
  )

  // - change l'id des tables liées (id de la ligne si basé sur l'id de l'étape)
  elementChildrenPropsUpdate(
    titreEtapeNew,
    titreEtapeIdNew,
    titreEtapeIdOld,
    titreEtapesProps
  )

  return { titreProps, titreEtapeNew }
}

const titreEtapesTypeIdUpdate = (titreEtapes, titre) =>
  titreEtapes.reduce(
    (acc, titreEtapeOld, i) => {
      const { id: titreEtapeOldId } = titreEtapeOld

      const { titreEtapeNew, titreProps } = titreEtapeIdUpdate(
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
      } = titreEtapesTypeIdUpdate(titreEtapes, titre)

      return {
        titreEtapesIdsOld: [...acc.titreEtapesIdsOld, ...titreEtapesIdsOld],
        titreEtapesNew: [...acc.titreEtapesNew, ...titreEtapesNew],
        titreProps: { ...acc.titreProps, ...titreProps }
      }
    },
    { titreEtapesIdsOld: [], titreEtapesNew: [], titreProps: {} }
  )

  if (titreEtapesNew.length) {
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
