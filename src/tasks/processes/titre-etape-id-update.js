import titreEtapesAscSort from '../utils/titre-etapes-asc-sort'
import { titrePropsUpdate, calculatedProps } from '../queries/titres'
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

const titreEtapesIdUpdate = async (titreEtape, titreDemarche, titre) => {
  const { id: titreEtapeIdOld } = titreEtape

  const titreEtapeTypeIdOld = titreEtapeIdOld.slice(-5, -2)
  const titreEtapeTypeIdNew = titreEtape.typeId

  console.log({ titreEtapeTypeIdOld, titreEtapeTypeIdNew })

  // les étapes de même type dans l'ordre asc
  const titreEtapesTypeIdOld = titreEtapesAscSort(
    titreDemarche.etapes.filter(te => te.type.id === titreEtapeTypeIdOld)
  )
  const titreEtapesTypeIdNew = titreEtapesAscSort(
    titreDemarche.etapes.filter(te => te.type.id === titreEtapeTypeIdNew)
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
          const { id: titreEtapeIdOld } = titreEtapeOld

          const titreEtapeTypeId = titreEtapeIdOld.slice(-5, -2)
          const titreEtapeOrder = titreEtapeIdOld.slice(-2)

          const titreEtapeOrderString = (i + 1).toString().padStart(2, '0')

          console.log(
            titreEtapeTypeId,
            titreEtapeOrder,
            titreEtapeOld.typeId,
            titreEtapeOrderString
          )

          if (
            // si le type d'une étape n'a pas changé
            titreEtapeTypeId === titreEtapeOld.typeId &&
            // et si l'ordre n'a pas changé
            titreEtapeOrder === titreEtapeOrderString
          ) {
            return acc
          }

          // fait une copie de l'étape
          const titreEtapeNew = { ...titreEtapeOld }

          // - change l'id de la nouvelle étape
          const titreEtapeIdNew = `${titreDemarche.id}-${
            titreEtapeOld.typeId
          }${titreEtapeOrderString}`
          titreEtapeNew.id = titreEtapeIdNew

          console.log({ titreEtapeIdOld, titreEtapeIdNew })

          const { titreProps } = calculatedProps.reduce(
            (acc, prop) => {
              if (Array.isArray(prop)) {
                return acc
              }

              // - const props = propriétés du titre qui pointent vers l'ancienne étape
              const titreProp = titre[`${prop}TitreEtapeId`]
              if (titreProp === titreEtapeIdOld) {
                console.log('changing')
                acc.titreProps[`${prop}TitreEtapeId`] = titreEtapeIdNew
              }

              if (prop.slice(-1)[0] !== 's') return acc

              // - change l'id des tables liées (id de la ligne et titreEtapeId)
              titreEtapeNew[prop].forEach(element => {
                console.log(prop, element.id)
                if (!element.id) {
                  console.log(element, prop)
                  return
                }

                const elementIdOld = element.id
                const elementIdNew = elementIdOld.replace(
                  titreEtapeIdOld,
                  titreEtapeIdNew
                )

                // console.log({ elementIdOld, elementIdNew })

                element.id = elementIdNew
              })

              return acc
            },
            { titreProps: {} }
          )

          console.log({ titreProps })
          // await titrePropsUpdate(titre.id, titreProps)

          //console.log(titreEtapeNew)

          // - ajoute la nouvelle étape dans la base

          // si props.length:
          // - change le titreEtapeId des props

          // - supprime l'ancienne étape dans la base

          return {
            titreEtapesIdsOld: [...acc.titreEtapesIdsOld, titreEtapeIdOld],
            titreEtapesNew: [...acc.titreEtapesNew, titreEtapeNew],
            titreProps: { ...acc.titreProps, ...titreProps }
          }
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

  console.log(JSON.stringify({ titreEtapesIdsOld, titreEtapesNew, titreProps }))

  if (titreEtapesNew.length) {
    await titreEtapesUpdateAll(titreEtapesIdsOld, titreEtapesNew)
  }

  return `Mise à jour: ${titreEtapesNew.length} id d'étapes.`
}

export default titreEtapesIdUpdate
