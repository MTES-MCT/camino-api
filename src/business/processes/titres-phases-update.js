import * as dateFormat from 'dateformat'
import {
  titrePhasesUpdate,
  titrePhasesDelete
} from '../../database/queries/titres-phases'
import titreDemarchesAscSort from '../utils/titre-demarches-asc-sort'
import titrePhasesFind from '../rules/titre-phases-find'
import PQueue from 'p-queue'

// retourne une phase parmi les titrePhases en fonction de son id
const titrePhaseEqualFind = (titreDemarcheId, titrePhases) =>
  titrePhases.find(tp => tp.titreDemarcheId === titreDemarcheId)

// retourne les propriétés de la phase existante
// qui sont différentes de la nouvelle phase
const titrePhasePropsChangedFind = (titrePhase, titrePhaseOld) =>
  Object.keys(titrePhase).reduce((res, key) => {
    let valueOld = titrePhaseOld[key]
    if (valueOld instanceof Date) {
      valueOld = dateFormat(valueOld, 'yyyy-mm-dd')
    }

    const valueNew = titrePhase[key]
    if (valueNew === valueOld) return res

    const log = { [key]: [valueOld, valueNew] }

    return { ...res, ...log }
  }, {})

const titrePhasesUpdatedFind = (titresPhasesOld, titrePhases) =>
  titrePhases.reduce((res, titrePhase) => {
    const titrePhaseOld = titrePhaseEqualFind(
      titrePhase.titreDemarcheId,
      titresPhasesOld
    )
    // si la phase n'existe pas
    // on l'ajoute à l'accumulateur
    if (!titrePhaseOld) return [...res, titrePhase]

    const titrePhasePropsChanged = titrePhasePropsChangedFind(
      titrePhase,
      titrePhaseOld
    )

    // si la phase existe et est modifiée
    return Object.keys(titrePhasePropsChanged).length
      ? [...res, titrePhase]
      : res
  }, [])

const titrePhasesDeletedFind = (titrePhasesOld, titresPhases) =>
  titrePhasesOld.reduce((res, titrePhaseOld) => {
    const titrePhase = titrePhaseEqualFind(
      titrePhaseOld.titreDemarcheId,
      titresPhases
    )

    return !titrePhase ? [...res, titrePhaseOld.titreDemarcheId] : res
  }, [])

const titresPhasesUpdate = async titres => {
  const titresPhasesRequests = titres.reduce((acc, titre) => {
    // met les démarches d'un titre dans le sens croissant avec `reverse()` :
    // les démarches données part `titresGet` sont dans l'ordre décroissant
    const demarches = titreDemarchesAscSort(titre.demarches.reverse())

    // retourne les phases enregistrées en base
    const titrePhasesOld = demarches.reduce(
      (res, td) => (td.phase ? [...res, td.phase] : res),
      []
    )

    // retourne un tableau avec les phases
    // créées à partir des démarches
    const titrePhases = titrePhasesFind(demarches, titre.typeId)

    const titrePhasesUpdateRequests = []

    const titrePhasesUpdated = titrePhasesUpdatedFind(
      titrePhasesOld,
      titrePhases
    )

    // retourne un tableau de requêtes pour
    // - créer les nouvelles phases
    // - modifier les phases existantes
    if (titrePhasesUpdated.length) {
      titrePhasesUpdateRequests.push(async () => {
        await titrePhasesUpdate(titrePhasesUpdated)
        console.log(`Mise à jour: phases ${JSON.stringify(titrePhasesUpdated)}`)
      })
    }

    const titrePhasesDeletedIds = titrePhasesDeletedFind(
      titrePhasesOld,
      titrePhases
    )

    // retourne un tableau de requêtes pour
    // - supprimer les phases qui n'existent plus

    if (titrePhasesDeletedIds.length) {
      titrePhasesUpdateRequests.push(async () => {
        await titrePhasesDelete(titrePhasesDeletedIds)
        console.log(`Suppression: phases ${titrePhasesDeletedIds.join(', ')}}`)
      })
    }

    return titrePhasesUpdateRequests.length
      ? [...acc, ...titrePhasesUpdateRequests]
      : acc
  }, [])

  if (titresPhasesRequests.length) {
    const queue = new PQueue({ concurrency: 100 })
    await queue.addAll(titresPhasesRequests)
  }

  return `Mise à jour: ${titresPhasesRequests.length} titre(s) (phases).`
}

export default titresPhasesUpdate
