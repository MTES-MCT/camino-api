import { titrePhaseUpdate, titrePhaseDelete } from '../queries/titre-phases'
import titreDemarchesAscSort from '../utils/titre-demarches-asc-sort'
import titrePhasesFind from '../rules/titre-phases-find'

const titresPhasesUpdate = async titres => {
  const titresPhasesQueries = titres.reduce((acc, titre) => {
    // remet les démarches d'un titre dans le sens croissant :
    // le `reverse()` est fait en partant du principe que les démarches sont
    // dans le sens décroissant, comme donné part `titresGet`
    const demarches = titreDemarchesAscSort(titre.demarches.reverse())

    const titreTypeId = titre.typeId

    // retourne les phases enregistrées en base
    const titrePhasesOld = demarches.reduce(
      (res, td) => (td.phase ? [...res, td.phase] : res),
      []
    )

    // retourne un tableau avec les phases
    // crées à partir des démarches
    const titrePhases = titrePhasesFind(demarches, titreTypeId)

    // retourne un tableau de requêtes pour
    // - créer les nouvelles phases
    // - modifier les phases existantes
    const titrePhasesUpdated = titrePhases.reduce((res, titrePhase) => {
      const titrePhaseUpdated = titrePhaseUpdate(titrePhase, titrePhasesOld)
      return !titrePhaseUpdated ? res : [...res, titrePhaseUpdated]
    }, [])

    // retourne un tableau de requêtes pour
    // - supprimer les phases qui n'existent plus
    const titrePhasesDeleted = titrePhasesOld.reduce((res, titrePhaseOld) => {
      const titrePhaseDeleted = titrePhaseDelete(titrePhaseOld, titrePhases)
      return !titrePhaseDeleted ? res : [...res, titrePhaseDeleted]
    }, [])

    const titrePhasesQueries = [
      ...titrePhasesUpdated,
      ...titrePhasesDeleted
    ].map(q => q.then(log => console.log(log)))

    return !titrePhasesQueries.length ? acc : [...acc, ...titrePhasesQueries]
  }, [])

  await Promise.all(titresPhasesQueries)

  return `Mise à jour: ${titresPhasesQueries.length} phases de titres.`
}

export default titresPhasesUpdate
