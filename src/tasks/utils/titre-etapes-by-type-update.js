import { calculatedProps as titreCalculatedProps } from '../queries/titres'
import elementRelationsUpdate from './element-relations-update'

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
  },
  {
    name: 'erreurs',
    elementIdProp: 'titreEtapeId'
  }
]

/**
 * Calcule les propriétés d'un titre à mettre à jour
 * @param {Titre} titre le titre à modifier
 * @param {String} titreEtapeNewId le nouvel id de l'étape
 * @param {String} titreEtapeOldId l'ancien id de l'étape
 * @param {Object} titreCalculatedProps les propriétés calculées du titre
 * @return {Object} les propriétés du titre à modifier
 */

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
  let titreEtapeNew = titreEtapeOld

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
  titreEtapeNew = elementRelationsUpdate(
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
