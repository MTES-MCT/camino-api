const { titrePhaseUpdate, titrePhaseDelete } = require('../titre-phases')
const titrePhasesFind = require('../_utils/titre-phases-find')

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
  const titresPhasesUpdated = titresPhases.reduce(
    (res, titrePhase) => titrePhaseUpdate(res, titrePhase, titresPhasesOld),
    []
  )

  // retourne un tableau de requêtes pour
  // - supprimer les phases qui n'existent plus
  const titrePhasesDeleted = titresPhasesOld.reduce(
    (res, titrePhaseOld) => titrePhaseDelete(res, titrePhaseOld, titresPhases),
    []
  )

  await Promise.all([...titresPhasesUpdated, ...titrePhasesDeleted])

  return `Mise à jour: ${titresPhasesUpdated.length} phases de titres.`
}

module.exports = titresPhasesUpdate
