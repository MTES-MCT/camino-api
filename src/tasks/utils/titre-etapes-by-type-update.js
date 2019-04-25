import { calculatedProps as titreCalculatedProps } from '../queries/titres'

// liste les relations hasManyRelations du modèle titresEtapes
const titreEtapesRelations = [
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
  titreEtapeNewId,
  titreEtapeOldId,
  titreCalculatedProps
) =>
  titreCalculatedProps.reduce((acc, prop) => {
    const titreProp = titre[`${prop}TitreEtapeId`]

    return titreProp === titreEtapeOldId
      ? { ...acc, [prop]: titreEtapeNewId }
      : acc
  }, {})

const elementRelationUpdate = (
  relations,
  titreEtapeNewId,
  titreEtapeOldId,
  elementIdProp
) => {
  relations.forEach(relation => {
    if (relation.id && relation.id.match(titreEtapeOldId)) {
      relation.id = relation.id.replace(titreEtapeOldId, titreEtapeNewId)
    }

    if (
      relation[elementIdProp] &&
      relation[elementIdProp].match(titreEtapeOldId)
    ) {
      relation[elementIdProp] = titreEtapeNewId
    }
  })
}

const elementRelationsUpdate = (
  element,
  titreEtapeNewId,
  titreEtapeOldId,
  titreEtapesRelations
) => {
  titreEtapesRelations.forEach(prop => {
    const relations = element[prop.name]
    if (!relations) return

    if (prop.children) {
      relations.forEach(element => {
        elementRelationsUpdate(
          element,
          titreEtapeNewId,
          titreEtapeOldId,
          prop.children
        )
      })
    }

    elementRelationUpdate(
      relations,
      titreEtapeNewId,
      titreEtapeOldId,
      prop.elementIdProp
    )
  })
}

const titreEtapeIdUpdate = (titreEtapeOld, titre, titreEtapeOrderNew) => {
  const { id: titreEtapeOldId } = titreEtapeOld

  const titreEtapeOldDemarcheId = titreEtapeOldId.slice(0, -6)
  const titreEtapeOldTypeId = titreEtapeOldId.slice(-5, -2)
  const titreEtapeOldOrder = titreEtapeOldId.slice(-2)

  titreEtapeOrderNew = titreEtapeOrderNew.toString().padStart(2, '0')

  if (
    // si l'id de la démarche n'a pas changé
    titreEtapeOldDemarcheId === titreEtapeOld.titreDemarcheId &&
    // si le type d'une étape n'a pas changé
    titreEtapeOldTypeId === titreEtapeOld.typeId &&
    // et si l'ordre n'a pas changé
    titreEtapeOldOrder === titreEtapeOrderNew
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
  const titreEtapeNewId = `${titreEtapeOld.titreDemarcheId}-${
    titreEtapeOld.typeId
  }${titreEtapeOrderNew}`

  titreEtapeNew.id = titreEtapeNewId

  // - const props = propriétés du titre qui pointent vers l'ancienne étape
  const titreProps = titreCalculatedPropsUpdate(
    titre,
    titreEtapeNewId,
    titreEtapeOldId,
    titreCalculatedProps
  )

  // - change l'id des tables liées (id de la ligne si basé sur l'id de l'étape)
  elementRelationsUpdate(
    titreEtapeNew,
    titreEtapeNewId,
    titreEtapeOldId,
    titreEtapesRelations
  )

  return { titreProps, titreEtapeNew }
}

const titreEtapesByTypeUpdate = (titreEtapes, titre) =>
  titreEtapes.reduce(
    (acc, titreEtapeOld, i) => {
      const { id: titreEtapeOldId } = titreEtapeOld

      const { titreEtapeNew, titreProps } = titreEtapeIdUpdate(
        titreEtapeOld,
        titre,
        i + 1
      )

      return titreEtapeNew
        ? {
            titreEtapesOldIds: [...acc.titreEtapesOldIds, titreEtapeOldId],
            titreEtapesNew: [...acc.titreEtapesNew, titreEtapeNew],
            titreProps: { ...acc.titreProps, ...titreProps }
          }
        : acc
    },
    { titreEtapesOldIds: [], titreEtapesNew: [], titreProps: {} }
  )

export default titreEtapesByTypeUpdate
