import titreEtapesAscSort from '../utils/titre-etapes-asc-sort'
import { titrePropsUpdate, calculatedProps } from '../queries/titres'

// si le type d'une étape change
// ou si l'ordre est 00 (ajout d'une nouvelle étape)
// - met à jour l'id de l'étape
// - met à jour l'id des tables liées (colonnes id et titreEtapeId)

// si des props du titre pointent vers l'étape:
// - met à jour le titreEtapeId des props

// const props = [
//   'substances',
//   ['points', 'pointsReferences'],
//   'titulaires',
//   'amodiataires',
//   'administrations',
//   'documents',
//   'communes',
//   'emprises'
// ]

const titreEtapesIdUpdate = async (titreEtapeId, titreDemarche) => {
  const titreEtape = titreDemarche.etapes.find(te => te.id === titreEtapeId)

  // les étapes de même type dans l'ordre asc
  const titreEtapes = titreEtapesAscSort(
    titreDemarche.etapes.filter(te => te.type.id === titreEtape.type.id)
  )

  const titreEtapesUpdateRequests = titreEtapes.reduce((acc, te, i) => {
    const titreEtapeTypeId = titreEtapeId.slice(-5, -2)
    const titreEtapeOrder = parseInt(titreEtapeId.slice(-2))
    console.log(titreEtapeTypeId, titreEtapeOrder, te.typeId)

    if (
      // si le type d'une étape n'a pas changé
      titreEtapeTypeId === te.typeId &&
      // et si l'ordre n'a pas changé
      titreEtapeOrder === i + 1
    ) {
      return acc
    }

    // fait une copie de l'étape
    // - change l'id de la nouvelle étape
    // - change l'id des tables liées (colonnes id et titreEtapeId)
    // - const props = propriété du titre qui pointent vers l'ancienne étape
    // - ajoute la nouvelle étape dans la base

    // si props.length:
    // - change le titreEtapeId des props

    // - supprime l'ancienne étape dans la base

    return acc
  }, [])

  return `Mise à jour: ${titreEtapesUpdateRequests.length} id d'étapes.`
}

export default titreEtapesIdUpdate
