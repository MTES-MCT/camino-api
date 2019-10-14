import PQueue from 'p-queue'

import {
  titrePhasesUpdate,
  titrePhasesDelete
} from '../../database/queries/titres-phases'
import titreDemarchesAscSort from '../utils/titre-demarches-asc-sort'
import titrePhasesFind from '../rules/titre-phases-find'

// retourne une phase parmi les titrePhases en fonction de son id
const titrePhaseEqualFind = (titreDemarcheId, titrePhases) =>
  titrePhases.find(tp => tp.titreDemarcheId === titreDemarcheId)

// retourne les propriétés de la phase existante
// qui sont différentes de la nouvelle phase
const titrePhasePropsChangedFind = (titrePhase, titrePhaseOld) =>
  Object.keys(titrePhase).reduce((res, key) => {
    const valueOld = titrePhaseOld[key]
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
  const queue = new PQueue({ concurrency: 100 })

  const { titresPhasesUpdated, titresPhasesDeleted } = titres.reduce(
    ({ titresPhasesUpdated, titresPhasesDeleted }, titre) => {
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

      // retourne un tableau avec les phases
      // créées à partir des démarches
      const titrePhases = titrePhasesFind(demarches, titre.typeId)

      const titrePhasesToUpdate = titrePhasesUpdatedFind(
        titrePhasesOld,
        titrePhases
      )

      if (titrePhasesToUpdate.length) {
        queue.add(async () => {
          await titrePhasesUpdate(titrePhasesToUpdate)

          console.log(
            `mise à jour: phases ${JSON.stringify(titrePhasesToUpdate)}`
          )

          titresPhasesUpdated.push(
            ...titrePhasesToUpdate.map(p => p.titreDemarcheId)
          )
        })
      }

      const titrePhasesToDeleteIds = titrePhasesDeletedFind(
        titrePhasesOld,
        titrePhases
      )

      if (titrePhasesToDeleteIds.length) {
        queue.add(async () => {
          await titrePhasesDelete(titrePhasesToDeleteIds)

          console.log(
            `suppression: phases ${titrePhasesToDeleteIds.join(', ')}`
          )

          titresPhasesDeleted.push(...titrePhasesToDeleteIds)
        })
      }

      return {
        titresPhasesUpdated,
        titresPhasesDeleted
      }
    },
    {
      titresPhasesUpdated: [],
      titresPhasesDeleted: []
    }
  )

  await queue.onIdle()

  return [titresPhasesUpdated, titresPhasesDeleted]
}

export default titresPhasesUpdate
