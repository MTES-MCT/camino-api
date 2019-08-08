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

    // met la prop à jour si les variables sont différentes
    if (valueNew !== valueOld) {
      res[key] = [valueOld, valueNew]
    }

    return res
  }, {})

const titrePhasesUpdatedFind = (titresPhasesOld, titrePhases) =>
  titrePhases.reduce((res, titrePhase) => {
    const titrePhaseOld = titrePhaseEqualFind(
      titrePhase.titreDemarcheId,
      titresPhasesOld
    )
    // si la phase n'existe pas
    // on l'ajoute à l'accumulateur
    if (!titrePhaseOld) {
      res.push(titrePhase)

      return res
    }

    const titrePhasePropsChanged = titrePhasePropsChangedFind(
      titrePhase,
      titrePhaseOld
    )

    // si la phase existe et est modifiée
    if (Object.keys(titrePhasePropsChanged).length) {
      res.push(titrePhase)
    }

    return res
  }, [])

const titrePhasesDeletedFind = (titrePhasesOld, titresPhases) =>
  titrePhasesOld.reduce((res, titrePhaseOld) => {
    const titrePhase = titrePhaseEqualFind(
      titrePhaseOld.titreDemarcheId,
      titresPhases
    )

    if (!titrePhase) {
      res.push(titrePhaseOld.titreDemarcheId)
    }

    return res
  }, [])

const titresPhasesUpdate = async titres => {
  const titresPhasesRequests = titres.reduce((acc, titre) => {
    // met les démarches d'un titre dans le sens croissant avec `reverse()` :
    // les démarches données part `titresGet` sont dans l'ordre décroissant
    const demarches = titreDemarchesAscSort(titre.demarches.reverse())

    // retourne les phases enregistrées en base
    const titrePhasesOld = demarches.reduce((res, td) => {
      if (td.phase) {
        res.push(td.phase)
      }

      return res
    }, [])
    // console.log(titrePhasesOld)

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
        console.log(`mise à jour: phases ${JSON.stringify(titrePhasesUpdated)}`)
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
        console.log(`suppression: phases ${titrePhasesDeletedIds.join(', ')}}`)
      })
    }

    if (titrePhasesUpdateRequests.length) {
      acc.push(...titrePhasesUpdateRequests)
    }

    return acc
  }, [])

  if (titresPhasesRequests.length) {
    const queue = new PQueue({ concurrency: 100 })
    await queue.addAll(titresPhasesRequests)
  }

  return `mise à jour: ${titresPhasesRequests.length} titre(s) (phases)`
}

export default titresPhasesUpdate
