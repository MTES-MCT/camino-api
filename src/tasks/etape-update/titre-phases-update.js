import { titrePhaseUpdate, titrePhaseDelete } from '../titre-phases'
import titrePhasesFind from '../_utils/titre-phases-find'

const titresPhasesUpdate = async titre => {
  const titreTypeId = titre.typeId
  // retourne les démarches enregistrées en base

  // retourne les phases enregistrées en base
  const titresPhasesOld = titre.demarches.reduce(
    (res, td) => (td.phase ? [...res, td.phase] : res),
    []
  )

  // retourne un tableau avec les phases
  // crées à partir des démarches
  const titresPhases = titrePhasesFind(titre.demarches, titreTypeId)

  // retourne un tableau de requêtes pour
  // - créer les nouvelles phases
  // - modifier les phases existantes
  const titresPhasesUpdated = titresPhases.reduce((res, titrePhase) => {
    const titrePhaseUpdated = titrePhaseUpdate(titrePhase, titresPhasesOld)
    return !titrePhaseUpdated ? res : [...res, titrePhaseUpdated]
  }, [])

  console.log({ titresPhasesOld })
  // retourne un tableau de requêtes pour
  // - supprimer les phases qui n'existent plus
  const titrePhasesDeleted = titresPhasesOld.reduce((res, titrePhaseOld) => {
    const titrePhaseDeleted = titrePhaseDelete(titrePhaseOld, titresPhases)
    return !titrePhaseDeleted ? res : [...res, titrePhaseDeleted]
  }, [])

  const titrePhasesQueries = [
    ...titresPhasesUpdated,
    ...titrePhasesDeleted
  ].map(q => q.then(log => console.log(log)))

  await Promise.all(titrePhasesQueries)

  return `Mise à jour: ${titresPhasesUpdated.length +
    titrePhasesDeleted.length} phases de titres.`
}

export default titresPhasesUpdate
