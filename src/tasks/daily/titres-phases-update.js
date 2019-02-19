import { titrePhaseUpdate, titrePhaseDelete } from '../titre-phases'

import titrePhasesFind from '../_utils/titre-phases-find'

const titresPhasesUpdate = async (titres, titresDemarches, titresPhasesOld) => {
  // créé un dictionnaire titre -> titre.typeId
  const titreTypeIdsList = titres.reduce((res, titre) => {
    res[titre.id] = titre.typeId
    return res
  }, {})

  // regroupe les démarches par titre
  const titresDemarchesGroupedByTitres = titreDemarchesByTitreGroup(
    titresDemarches
  )

  // retourne un tableau avec les phases
  // crées à partir des démarches
  const titresPhases = Object.keys(titresDemarchesGroupedByTitres).reduce(
    (res, titreId) => [
      ...res,
      ...titrePhasesFind(
        titresDemarchesGroupedByTitres[titreId],
        titreTypeIdsList[titreId]
      )
    ],
    []
  )

  // retourne un tableau de requêtes pour
  // - créer les nouvelles phases
  // - modifier les phases existantes
  const titresPhasesUpdated = titresPhases.reduce((res, titrePhase) => {
    const titrePhaseUpdated = titrePhaseUpdate(titrePhase, titresPhasesOld)
    return !titrePhaseUpdated ? res : [...res, titrePhaseUpdated]
  }, [])

  // retourne un tableau de requêtes pour
  // - supprimer les phases qui n'existent plus
  const titrePhasesDeleted = titresPhasesOld.reduce((res, titrePhaseOld) => {
    const titrePhaseDeleted = titrePhaseDelete(titrePhaseOld, titresPhases)
    return !titrePhaseDeleted ? res : [...res, titrePhaseDeleted]
  }, [])

  await Promise.all([...titresPhasesUpdated, ...titrePhasesDeleted])

  return `Mise à jour: ${titresPhasesUpdated.length} phases de titres.`
}

const titreDemarchesByTitreGroup = titreDemarches =>
  titreDemarches.reduce((titreDemarchesByTitres, titreDemarche) => {
    titreDemarchesByTitres[titreDemarche.titreId] = titreDemarchesByTitres[
      titreDemarche.titreId
    ]
      ? [...titreDemarchesByTitres[titreDemarche.titreId], titreDemarche]
      : [titreDemarche]
    return titreDemarchesByTitres
  }, {})

export default titresPhasesUpdate
